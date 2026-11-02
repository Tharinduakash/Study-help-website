"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { faqs, inquiries, inquiryNotes, portfolioImages, portfolioProjects, quotations, serviceCategories, services, teamMembers, testimonials, websiteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { invalid, type FormState } from "@/lib/form-state";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE } from "@/lib/storage-config";
import { removeMedia, signMediaUpload, storageConfigured } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import { categorySchema, faqSchema, imageRequestSchema, inquiryStatusSchema, noteSchema, projectSchema, quotationSchema, serviceSchema, settingsSchema, teamSchema, testimonialSchema } from "./schemas";

// Public pages are prerendered, so every content change must refresh them.
function revalidateSite() {
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
}

const values = (formData: FormData) => Object.fromEntries(formData);
const idOf = (formData: FormData) => z.uuid().safeParse(formData.get("id")).data;

function isUniqueViolation(error: unknown) {
  const cause = (error as { cause?: { code?: string }; code?: string })?.cause ?? (error as { code?: string });
  return cause?.code === "23505";
}

const slugTaken: FormState = { message: "That web address is already used.", errors: { slug: "Choose a different web address" } };

export async function saveCategory(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  try {
    if (id) await db.update(serviceCategories).set(data).where(eq(serviceCategories.id, id));
    else await db.insert(serviceCategories).values(data);
  } catch (error) {
    if (isUniqueViolation(error)) return slugTaken;
    throw error;
  }
  revalidateSite();
  redirect("/admin/services");
}

export async function deleteCategory(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Category not found." };
  const [{ total }] = await db.select({ total: count() }).from(services).where(eq(services.categoryId, id));
  if (total > 0) return { message: `This category still has ${total} service${total === 1 ? "" : "s"}. Delete or move them first, or deactivate it instead.` };
  await db.delete(serviceCategories).where(eq(serviceCategories.id, id));
  revalidateSite();
  redirect("/admin/services");
}

export async function saveService(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  try {
    if (id) await db.update(services).set(data).where(eq(services.id, id));
    else await db.insert(services).values(data);
  } catch (error) {
    if (isUniqueViolation(error)) return slugTaken;
    throw error;
  }
  revalidateSite();
  redirect("/admin/services");
}

export async function deleteService(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Service not found." };
  await db.delete(services).where(eq(services.id, id));
  revalidateSite();
  redirect("/admin/services");
}

export async function saveProject(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  const data = { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.title) };
  let savedId = id;
  try {
    if (id) await db.update(portfolioProjects).set(data).where(eq(portfolioProjects.id, id));
    else [{ id: savedId }] = await db.insert(portfolioProjects).values(data).returning({ id: portfolioProjects.id });
  } catch (error) {
    if (isUniqueViolation(error)) return slugTaken;
    throw error;
  }
  revalidateSite();
  // New projects open for editing so gallery images can be added straight away.
  redirect(id ? "/admin/portfolio" : `/admin/portfolio/${savedId}`);
}

export async function deleteProject(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Project not found." };
  const images = await db.select({ url: portfolioImages.url }).from(portfolioImages).where(eq(portfolioImages.projectId, id));
  const [project] = await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id)).returning({ cover: portfolioProjects.coverImageUrl });
  if (storageConfigured()) {
    await Promise.all([...images.map((image) => image.url), project?.cover].filter((url): url is string => !!url).map(removeMedia));
  }
  revalidateSite();
  redirect("/admin/portfolio");
}

export async function addGalleryImage(projectId: string, url: string) {
  await requireAdmin();
  const parsed = z.object({ projectId: z.uuid(), url: z.url() }).parse({ projectId, url });
  const [{ total }] = await db.select({ total: count() }).from(portfolioImages).where(eq(portfolioImages.projectId, parsed.projectId));
  await db.insert(portfolioImages).values({ ...parsed, sortOrder: total });
  revalidateSite();
}

export async function deleteGalleryImage(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Image not found." };
  const [image] = await db.delete(portfolioImages).where(eq(portfolioImages.id, id)).returning({ url: portfolioImages.url });
  if (image && storageConfigured()) await removeMedia(image.url);
  revalidateSite();
  return { ok: true };
}

export async function saveTeamMember(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = teamSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  if (id) await db.update(teamMembers).set(parsed.data).where(eq(teamMembers.id, id));
  else await db.insert(teamMembers).values(parsed.data);
  revalidateSite();
  redirect("/admin/team");
}

export async function deleteTeamMember(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Team member not found." };
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
  revalidateSite();
  redirect("/admin/team");
}

export async function saveTestimonial(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  if (id) await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values(parsed.data);
  revalidateSite();
  redirect("/admin/testimonials");
}

export async function setTestimonialStatus(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  const status = z.enum(["approved", "rejected"]).safeParse(formData.get("status"));
  if (!id || !status.success) return { message: "Review not found." };
  await db.update(testimonials).set({ status: status.data }).where(eq(testimonials.id, id));
  revalidateSite();
  return { ok: true };
}

export async function deleteTestimonial(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "Review not found." };
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidateSite();
  redirect("/admin/testimonials");
}

export async function saveFaq(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = faqSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  const id = idOf(formData);
  if (id) await db.update(faqs).set(parsed.data).where(eq(faqs.id, id));
  else await db.insert(faqs).values(parsed.data);
  revalidateSite();
  redirect("/admin/faqs");
}

export async function deleteFaq(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idOf(formData);
  if (!id) return { message: "FAQ not found." };
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidateSite();
  redirect("/admin/faqs");
}

export async function saveSettings(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  await db.transaction(async (tx) => {
    for (const [key, value] of Object.entries(parsed.data)) {
      await tx.insert(websiteSettings).values({ key, value }).onConflictDoUpdate({ target: websiteSettings.key, set: { value } });
    }
  });
  revalidateSite();
  return { ok: true, message: "Settings saved. The public site has been updated." };
}

export async function updateInquiryStatus(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = inquiryStatusSchema.safeParse(values(formData));
  if (!parsed.success) return { message: "Choose a valid status." };
  await db.update(inquiries).set({ status: parsed.data.status }).where(eq(inquiries.id, parsed.data.id));
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Status updated." };
}

export async function addInquiryNote(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = noteSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  await db.insert(inquiryNotes).values({ ...parsed.data, authorId: admin.id });
  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  return { ok: true, message: "Note added." };
}

export async function addQuotation(_previous: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = quotationSchema.safeParse(values(formData));
  if (!parsed.success) return invalid(parsed.error);
  await db.insert(quotations).values({ ...parsed.data, createdById: admin.id });
  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  return { ok: true, message: "Quotation recorded." };
}

export async function deleteQuotation(_previous: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = z.object({ id: z.uuid(), inquiryId: z.uuid() }).safeParse(values(formData));
  if (!parsed.success) return { message: "Quotation not found." };
  await db.delete(quotations).where(and(eq(quotations.id, parsed.data.id), eq(quotations.inquiryId, parsed.data.inquiryId)));
  revalidatePath(`/admin/inquiries/${parsed.data.inquiryId}`);
  return { ok: true };
}

export async function requestImageUpload(input: { folder: string; name: string; type: string; size: number }) {
  await requireAdmin();
  const parsed = imageRequestSchema.safeParse(input);
  if (!parsed.success || !(IMAGE_MIME_TYPES as readonly string[]).includes(parsed.data.type)) return { error: "Use a JPG, PNG or WebP image." };
  if (parsed.data.size > MAX_IMAGE_SIZE) return { error: "Images must be 8 MB or smaller." };
  if (!storageConfigured()) return { error: "Supabase Storage is not configured yet." };
  return signMediaUpload(parsed.data.folder, parsed.data.name);
}
