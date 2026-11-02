import { StorageClient } from "@supabase/storage-js";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE, MEDIA_BUCKET, PRIVATE_BUCKET } from "@/lib/storage-config";
import { MAX_FILE_SIZE } from "@/lib/inquiry-schema";

// Creates both buckets, or brings their limits up to date. Safe to run repeatedly.
async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

  const storage = new StorageClient(`${url}/storage/v1`, { apikey: key, Authorization: `Bearer ${key}` });
  const buckets = [
    { name: PRIVATE_BUCKET, options: { public: false, fileSizeLimit: MAX_FILE_SIZE } },
    { name: MEDIA_BUCKET, options: { public: true, fileSizeLimit: MAX_IMAGE_SIZE, allowedMimeTypes: [...IMAGE_MIME_TYPES] } },
  ];

  for (const { name, options } of buckets) {
    const created = await storage.createBucket(name, options);
    if (created.error) {
      const updated = await storage.updateBucket(name, options);
      if (updated.error) throw updated.error;
    }
    console.log(`Bucket ready: ${name} (${options.public ? "public" : "private"})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
