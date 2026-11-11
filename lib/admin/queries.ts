import "server-only";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { faqs, inquiries, inquiryAttachments, inquiryNotes, inquiryStatus, portfolioImages, portfolioProjects, quotations, serviceCategories, services, teamMembers, testimonials, users } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/session";

// Every read here returns private data or unpublished drafts, so each one checks the session itself.
export const INQUIRY_PAGE_SIZE = 25;
export type InquiryStatus = (typeof inquiryStatus.enumValues)[number];

export async function getDashboard() {
  await requireAdmin();
  const [byStatus, [projects], [pendingReviews], recent] = await Promise.all([
    db.select({ status: inquiries.status, total: count() }).from(inquiries).groupBy(inquiries.status),
    db.select({ total: count() }).from(portfolioProjects),
    db.select({ total: count() }).from(testimonials).where(eq(testimonials.status, "pending")),
    db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(6),
  ]);
  const of = (...statuses: InquiryStatus[]) => byStatus.filter((row) => statuses.includes(row.status)).reduce((sum, row) => sum + row.total, 0);
  return {
    total: byStatus.reduce((sum, row) => sum + row.total, 0),
    newInquiries: of("New"),
    active: of("Approved", "In Progress"),
    completed: of("Completed"),
    portfolio: projects.total,
    pendingReviews: pendingReviews.total,
    recent,
  };
}

export async function listCategoriesWithServices() {
  await requireAdmin();
  const [categories, rows] = await Promise.all([
    db.select().from(serviceCategories).orderBy(asc(serviceCategories.sortOrder)),
    db.select().from(services).orderBy(asc(services.sortOrder)),
  ]);
  return categories.map((category) => ({ ...category, services: rows.filter((row) => row.categoryId === category.id) }));
}

export async function listCategoryOptions() {
  await requireAdmin();
  const rows = await db.select({ value: serviceCategories.id, label: serviceCategories.title }).from(serviceCategories).orderBy(asc(serviceCategories.sortOrder));
  return rows;
}

export async function getCategory(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id)).limit(1);
  return row ?? null;
}

export async function getServiceRow(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return row ?? null;
}

export async function listProjects() {
  await requireAdmin();
  return db.select().from(portfolioProjects).orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt));
}

export async function getProjectRow(id: string) {
  await requireAdmin();
  const [project] = await db.select().from(portfolioProjects).where(eq(portfolioProjects.id, id)).limit(1);
  if (!project) return null;
  const images = await db.select().from(portfolioImages).where(eq(portfolioImages.projectId, id)).orderBy(asc(portfolioImages.sortOrder));
  return { project, images };
}

export async function listTeam() {
  await requireAdmin();
  return db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
}

export async function getTeamRow(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return row ?? null;
}

export async function listTestimonials() {
  await requireAdmin();
  // Pending reviews first, so new submissions are the first thing to moderate.
  return db.select().from(testimonials).orderBy(sql`${testimonials.status} = 'pending' desc`, desc(testimonials.createdAt));
}

export async function countPendingTestimonials() {
  await requireAdmin();
  const [row] = await db.select({ total: count() }).from(testimonials).where(eq(testimonials.status, "pending"));
  return row.total;
}

export async function getTestimonialRow(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return row ?? null;
}

export async function listFaqs() {
  await requireAdmin();
  return db
    .select({ faq: faqs, category: serviceCategories.title })
    .from(faqs)
    .leftJoin(serviceCategories, eq(serviceCategories.id, faqs.categoryId))
    .orderBy(asc(serviceCategories.sortOrder), asc(faqs.sortOrder));
}

export async function getFaqRow(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return row ?? null;
}

export async function listInquiries({ status, search, page }: { status?: InquiryStatus; search?: string; page: number }) {
  await requireAdmin();
  const term = search ? `%${search.replace(/[%_]/g, "")}%` : null;
  const where = and(
    status ? eq(inquiries.status, status) : undefined,
    term ? or(ilike(inquiries.reference, term), ilike(inquiries.name, term), ilike(inquiries.email, term)) : undefined,
  );
  const [rows, [{ total }]] = await Promise.all([
    db.select().from(inquiries).where(where).orderBy(desc(inquiries.createdAt)).limit(INQUIRY_PAGE_SIZE).offset((page - 1) * INQUIRY_PAGE_SIZE),
    db.select({ total: count() }).from(inquiries).where(where),
  ]);
  return { rows, total };
}

export async function getInquiry(id: string) {
  await requireAdmin();
  const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  if (!inquiry) return null;
  const [attachments, notes, quotes] = await Promise.all([
    db.select().from(inquiryAttachments).where(eq(inquiryAttachments.inquiryId, id)).orderBy(asc(inquiryAttachments.createdAt)),
    db.select({ note: inquiryNotes, author: users.name }).from(inquiryNotes).leftJoin(users, eq(users.id, inquiryNotes.authorId)).where(eq(inquiryNotes.inquiryId, id)).orderBy(desc(inquiryNotes.createdAt)),
    db.select().from(quotations).where(eq(quotations.inquiryId, id)).orderBy(desc(quotations.createdAt)),
  ]);
  return { inquiry, attachments, notes, quotes };
}

export async function getAttachment(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(inquiryAttachments).where(eq(inquiryAttachments.id, id)).limit(1);
  return row ?? null;
}
