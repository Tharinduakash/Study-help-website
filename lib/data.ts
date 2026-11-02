import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import { faqs, portfolioImages, portfolioProjects, serviceCategories, services, teamMembers, testimonials, websiteSettings } from "@/db/schema";
import type { CoverVariant, PortfolioCategory, PortfolioProject } from "@/lib/content/portfolio";
import type { ServiceCategory } from "@/lib/content/services";
import { defaultSettings, type SiteSettings } from "@/lib/site-config";

// The single read layer for public pages. Pages render statically from these
// queries; admin saves call revalidateSite() to refresh them.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const rows = await db.select().from(websiteSettings);
  return { ...defaultSettings, ...Object.fromEntries(rows.map((row) => [row.key, row.value])) };
});

export const getServiceCategories = cache(async (): Promise<ServiceCategory[]> => {
  const categories = await db.select().from(serviceCategories).where(eq(serviceCategories.isActive, true)).orderBy(asc(serviceCategories.sortOrder));
  if (categories.length === 0) return [];

  const ids = categories.map((category) => category.id);
  const [serviceRows, faqRows] = await Promise.all([
    db.select().from(services).where(and(inArray(services.categoryId, ids), eq(services.isActive, true))).orderBy(asc(services.sortOrder)),
    db.select().from(faqs).where(and(inArray(faqs.categoryId, ids), eq(faqs.isActive, true))).orderBy(asc(faqs.sortOrder)),
  ]);

  return categories.map((category, index) => ({
    slug: category.slug,
    number: String(index + 1).padStart(2, "0"),
    title: category.title,
    short: category.short,
    description: category.description,
    imageUrl: category.imageUrl,
    icon: category.icon as ServiceCategory["icon"],
    deliverables: category.deliverables,
    note: category.note,
    faqs: faqRows.filter((faq) => faq.categoryId === category.id).map(({ question, answer }) => ({ question, answer })),
    services: serviceRows.filter((service) => service.categoryId === category.id).map((service) => ({
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      description: service.description,
      imageUrl: service.imageUrl,
      options: service.options,
      pricing: service.pricingType === "fixed" ? { type: "fixed" as const, label: service.priceLabel ?? "" } : { type: "quote" as const },
    })),
  }));
});

export async function getServiceCategory(slug: string) {
  return (await getServiceCategories()).find((category) => category.slug === slug) ?? null;
}

export async function getService(categorySlug: string, serviceSlug: string) {
  const category = await getServiceCategory(categorySlug);
  const service = category?.services.find((item) => item.slug === serviceSlug);
  return category && service ? { category, service } : null;
}

export const getProjects = cache(async (): Promise<PortfolioProject[]> => {
  const rows = await db
    .select({ project: portfolioProjects, categorySlug: serviceCategories.slug })
    .from(portfolioProjects)
    .leftJoin(serviceCategories, eq(serviceCategories.id, portfolioProjects.serviceCategoryId))
    .where(eq(portfolioProjects.isPublished, true))
    .orderBy(asc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt));
  if (rows.length === 0) return [];

  const images = await db.select().from(portfolioImages).where(inArray(portfolioImages.projectId, rows.map((row) => row.project.id))).orderBy(asc(portfolioImages.sortOrder));

  return rows.map(({ project, categorySlug }) => ({
    slug: project.slug,
    title: project.title,
    category: project.category as PortfolioCategory,
    categorySlug: categorySlug ?? "",
    summary: project.summary,
    description: project.description,
    tags: project.tags,
    deliverables: project.deliverables,
    outcomes: project.outcomes,
    cover: project.coverVariant as CoverVariant,
    coverImageUrl: project.coverImageUrl,
    videoUrl: project.videoUrl,
    gallery: images.filter((image) => image.projectId === project.id).map(({ url, alt }) => ({ url, alt })),
    isSample: project.isSample,
    featured: project.isFeatured,
  }));
});

export async function getFeaturedProjects() {
  return (await getProjects()).filter((project) => project.featured);
}

export async function getProject(slug: string) {
  return (await getProjects()).find((project) => project.slug === slug) ?? null;
}

export async function getProjectsForCategory(categorySlug: string) {
  return (await getProjects()).filter((project) => project.categorySlug === categorySlug);
}

export const getTeamMembers = cache(async () => {
  const rows = await db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(asc(teamMembers.sortOrder));
  return rows.map(({ id, name, designation, bio, skills, imageUrl, links }) => ({ id, name, designation, bio, skills, image: imageUrl, links }));
});

// Only approved reviews are ever selected for the public site.
export const getTestimonials = cache(async () => {
  return db
    .select({ quote: testimonials.quote, name: testimonials.name, service: testimonials.service, rating: testimonials.rating })
    .from(testimonials)
    .where(eq(testimonials.status, "approved"))
    .orderBy(desc(testimonials.createdAt));
});

export const getFaqs = cache(async () => {
  return db
    .select({ question: faqs.question, answer: faqs.answer })
    .from(faqs)
    .where(and(isNull(faqs.categoryId), eq(faqs.isActive, true)))
    .orderBy(asc(faqs.sortOrder));
});
