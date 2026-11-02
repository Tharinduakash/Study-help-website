import "server-only";
import { randomUUID } from "node:crypto";
import { StorageClient } from "@supabase/storage-js";
import { MEDIA_BUCKET, PRIVATE_BUCKET } from "@/lib/storage-config";

export function storageConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Uses the service role key, so this module must only ever run on the server.
function storage() {
  if (!storageConfigured()) throw new Error("Supabase Storage is not configured.");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return new StorageClient(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1`, { apikey: key, Authorization: `Bearer ${key}` });
}

function safeName(name: string) {
  const cleaned = name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  return cleaned.slice(-100) || "file";
}

export function newUploadId() {
  return randomUUID();
}

// Browsers upload directly to storage with these one-time URLs, because Server
// Actions and Vercel functions cannot accept request bodies this large.
export async function signInquiryUpload(uploadId: string, fileName: string) {
  const path = `${uploadId}/${randomUUID()}-${safeName(fileName)}`;
  const { data, error } = await storage().from(PRIVATE_BUCKET).createSignedUploadUrl(path);
  if (error) throw error;
  return { name: fileName, signedUrl: data.signedUrl };
}

// The bucket listing is the source of truth: file names and sizes sent by the browser are never trusted.
export async function listInquiryUploads(uploadId: string) {
  const { data, error } = await storage().from(PRIVATE_BUCKET).list(uploadId, { limit: 20 });
  if (error) throw error;
  return data.filter((file) => file.id).map((file) => ({
    path: `${uploadId}/${file.name}`,
    // Stored as <uuid>-<name>; the uuid is 36 characters plus the dash.
    name: file.name.slice(37),
    size: Number(file.metadata?.size ?? 0),
    contentType: (file.metadata?.mimetype as string | undefined) ?? null,
  }));
}

export async function removeInquiryFiles(paths: string[]) {
  if (paths.length === 0) return;
  const { error } = await storage().from(PRIVATE_BUCKET).remove(paths);
  if (error) throw error;
}

export async function signedDownloadUrl(path: string, fileName: string) {
  const { data, error } = await storage().from(PRIVATE_BUCKET).createSignedUrl(path, 60, { download: fileName });
  if (error) throw error;
  return data.signedUrl;
}

export async function signMediaUpload(folder: string, fileName: string) {
  const path = `${folder}/${randomUUID()}-${safeName(fileName)}`;
  const bucket = storage().from(MEDIA_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error) throw error;
  return { signedUrl: data.signedUrl, publicUrl: bucket.getPublicUrl(path).data.publicUrl };
}

export async function removeMedia(publicUrl: string) {
  const marker = `/object/public/${MEDIA_BUCKET}/`;
  const position = publicUrl.indexOf(marker);
  if (position === -1) return;
  const { error } = await storage().from(MEDIA_BUCKET).remove([publicUrl.slice(position + marker.length)]);
  if (error) console.error("Could not remove media file", error);
}
