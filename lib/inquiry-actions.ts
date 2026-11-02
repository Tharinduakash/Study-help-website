"use server";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { inquiries, inquiryAttachments, serviceCategories, services } from "@/db/schema";
import { notifyAdmin } from "@/lib/email";
import { MAX_FILES, fileError, inquirySchema, type InquiryState } from "@/lib/inquiry-schema";
import { clientKey, consumeRateLimit } from "@/lib/rate-limit";
import { listInquiryUploads, newUploadId, removeInquiryFiles, signInquiryUpload, storageConfigured } from "@/lib/storage";

const fileList = z.array(z.object({ name: z.string().min(1).max(200), size: z.number().int().positive() })).min(1).max(MAX_FILES);

type UploadTicket = { error: string } | { uploadId: string; uploads: { name: string; signedUrl: string }[] };

// First step of a submission with files: checks each file, then returns one-time
// URLs so the browser can upload straight into the private bucket.
export async function prepareInquiryUploads(input: { name: string; size: number }[]): Promise<UploadTicket> {
  const parsed = fileList.safeParse(input);
  if (!parsed.success) return { error: `Attach up to ${MAX_FILES} files.` };
  const problem = parsed.data.map(fileError).find(Boolean);
  if (problem) return { error: problem };

  if (!storageConfigured()) return { error: "File uploads are unavailable right now. Please remove your files and send them after we reply." };
  if (!(await consumeRateLimit(`upload:${await clientKey()}`, 10, 3600))) return { error: "Too many uploads. Please try again later." };

  const uploadId = newUploadId();
  try {
    const uploads = await Promise.all(parsed.data.map((file) => signInquiryUpload(uploadId, file.name)));
    return { uploadId, uploads };
  } catch (error) {
    console.error("Could not prepare uploads", error);
    return { error: "We could not prepare your upload. Please try again." };
  }
}

export async function submitInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" && value !== "" ? value : undefined;
  };

  // Hidden from people by the form, so only bots fill it in.
  if (text("website")) return { status: "error", message: "We could not process your request." };

  const parsed = inquirySchema.safeParse({
    category: text("category"),
    service: text("service"),
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),
    deadline: text("deadline"),
  });
  const uploadId = z.uuid().safeParse(text("uploadId"));
  if (text("uploadId") && !uploadId.success) return { status: "error", message: "Your upload could not be verified. Please try again." };

  if (!parsed.success) {
    const errors: Record<string, string | undefined> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { status: "invalid", errors };
  }
  const input = parsed.data;

  if (!(await consumeRateLimit(`inquiry:${await clientKey()}`, 8, 3600))) {
    return { status: "error", message: "Too many requests. Please try again later or contact us on WhatsApp." };
  }

  try {
    const [category] = input.category
      ? await db.select({ id: serviceCategories.id, title: serviceCategories.title }).from(serviceCategories).where(and(eq(serviceCategories.slug, input.category), eq(serviceCategories.isActive, true))).limit(1)
      : [];
    const [service] = category && input.service
      ? await db.select({ id: services.id, title: services.title }).from(services).where(and(eq(services.categoryId, category.id), eq(services.slug, input.service), eq(services.isActive, true))).limit(1)
      : [];

    const files = uploadId.success ? await listInquiryUploads(uploadId.data) : [];
    const rejected = files.length > MAX_FILES ? files : files.filter((file) => fileError(file));
    if (rejected.length > 0) {
      await removeInquiryFiles(rejected.map((file) => file.path));
      return { status: "error", message: "One of your files was rejected. Please check its type and size, then try again." };
    }

    const created = await db.transaction(async (tx) => {
      const [{ next }] = await tx.execute<{ next: string }>(sql`select nextval('inquiry_reference_seq') as next`);
      const reference = `SH-${new Date().getFullYear()}-${String(next).padStart(5, "0")}`;
      const [row] = await tx.insert(inquiries).values({
        reference,
        source: text("source") === "contact" ? "contact" : "quote",
        categoryId: category?.id,
        serviceId: service?.id,
        categoryTitle: category?.title,
        serviceTitle: service?.title,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        deadline: input.deadline,
      }).returning({ id: inquiries.id, reference: inquiries.reference });
      if (files.length > 0) {
        await tx.insert(inquiryAttachments).values(files.map((file) => ({
          inquiryId: row.id,
          fileName: file.name,
          storagePath: file.path,
          sizeBytes: file.size,
          contentType: file.contentType,
        })));
      }
      return row;
    });

    await notifyAdmin({ ...created, ...input, service: service?.title ?? category?.title, fileCount: files.length });
    return { status: "success", reference: created.reference };
  } catch (error) {
    console.error("Could not save inquiry", error);
    return { status: "error", message: "Something went wrong and your request was not saved. Please try again or contact us on WhatsApp." };
  }
}
