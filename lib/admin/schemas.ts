import { z } from "zod";
import { portfolioCategories } from "@/lib/content/portfolio";

const isWebUrl = (value: string) => {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const text = (label: string, max = 300) => z.string().trim().min(1, `${label} is required`).max(max);
const optionalText = (max = 5000) => z.string().trim().max(max).transform((value) => value || null).nullable().optional().default(null);
const flag = z.literal("on").optional().transform(Boolean);
const sortOrder = z.coerce.number().int().min(0).max(9999).catch(0);
// Bundled artwork lives under /images; uploads and video links are full addresses.
const webUrl = z.string().trim().max(1000).refine((value) => !value || value.startsWith("/images/") || isWebUrl(value), "Enter a full web address").transform((value) => value || null).optional().default(null);
const slug = z.string().trim().max(120).regex(/^[a-z0-9-]*$/, "Use lowercase letters, numbers and hyphens").optional().default("");
const lines = z.string().default("").transform((value) => value.split("\n").map((line) => line.trim()).filter(Boolean));
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")).optional().transform((value) => value || null);

// One link per line, written as: Label | https://example.com
export const linkLines = z.string().default("").transform((value, context) => {
  const links = value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [label, href] = line.split("|").map((part) => part.trim());
    return { label, href };
  });
  if (links.some((link) => !link.label || !link.href || !isWebUrl(link.href))) {
    context.addIssue({ code: "custom", message: "Write each link as: Label | https://example.com" });
    return z.NEVER;
  }
  return links;
});

export const categorySchema = z.object({
  slug,
  title: text("Title", 120),
  short: text("Short description", 300),
  description: text("Description", 3000),
  icon: z.enum(["chart", "book", "code", "presentation", "video"]),
  imageUrl: webUrl,
  deliverables: lines,
  note: optionalText(600),
  sortOrder,
  isActive: flag,
});

export const serviceSchema = z.object({
  categoryId: z.uuid("Choose a category"),
  slug,
  title: text("Title", 120),
  summary: text("Summary", 400),
  description: optionalText(),
  imageUrl: webUrl,
  options: lines,
  pricingType: z.enum(["quote", "fixed"]),
  priceLabel: optionalText(80),
  sortOrder,
  isActive: flag,
}).refine((value) => value.pricingType !== "fixed" || value.priceLabel, { path: ["priceLabel"], message: "Enter the price to display" });

export const projectSchema = z.object({
  slug,
  title: text("Title", 160),
  category: z.enum(portfolioCategories, "Choose a category"),
  serviceCategoryId: z.uuid().or(z.literal("")).transform((value) => value || null),
  summary: text("Summary", 400),
  description: text("Description", 5000),
  tags: lines,
  outcomes: lines,
  deliverables: lines,
  coverVariant: z.enum(["dashboard", "report", "slides", "code", "poster", "video"]),
  coverImageUrl: webUrl,
  videoUrl: webUrl,
  sortOrder,
  isSample: flag,
  isFeatured: flag,
  isPublished: flag,
});

export const teamSchema = z.object({
  name: text("Name", 120),
  designation: text("Designation", 120),
  bio: text("Biography", 800),
  skills: lines,
  imageUrl: webUrl,
  links: linkLines,
  sortOrder,
  isActive: flag,
});

export const testimonialSchema = z.object({
  name: text("Name", 120),
  service: text("Service", 120),
  quote: text("Review", 1000),
  rating: z.coerce.number().int().min(1, "Rating must be 1 to 5").max(5, "Rating must be 1 to 5"),
  status: z.enum(["pending", "approved", "rejected"]),
});

export const faqSchema = z.object({
  question: text("Question", 300),
  answer: text("Answer", 2000),
  categoryId: z.uuid().or(z.literal("")).transform((value) => value || null),
  sortOrder,
  isActive: flag,
});

export const settingsSchema = z.object({
  whatsappNumber: z.string().trim().regex(/^\d{0,15}$/, "Digits only, in international format, e.g. 94771234567"),
  email: z.email("Enter a valid email").or(z.literal("")),
  phone: z.string().trim().max(30),
  serviceArea: z.string().trim().max(200),
  socials: linkLines,
  heroHeadline: text("Headline", 120),
  heroText: z.string().trim().max(400),
  ctaHeadline: text("Headline", 120),
  ctaText: text("Supporting text", 300),
  companyIntro: text("Introduction", 800),
  story: text("Story", 3000),
  mission: text("Mission", 600),
  vision: text("Vision", 600),
  aboutImageUrl: webUrl,
  pageHeroImageUrl: webUrl,
  heroAboutImageUrl: webUrl,
  heroServicesImageUrl: webUrl,
  heroTeamImageUrl: webUrl,
  heroContactImageUrl: webUrl,
  heroFaqImageUrl: webUrl,
  heroQuoteImageUrl: webUrl,
  heroReviewImageUrl: webUrl,
  heroLegalImageUrl: webUrl,
  ctaImageUrl: webUrl,
});

export const inquiryStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["New", "Reviewing", "Quotation Sent", "Approved", "In Progress", "Completed", "Cancelled"]),
});

export const noteSchema = z.object({ inquiryId: z.uuid(), body: text("Note", 3000) });

export const quotationSchema = z.object({
  inquiryId: z.uuid(),
  amount: z.coerce.number("Enter an amount").min(0, "Enter an amount").max(9_999_999_999).transform((value) => value.toFixed(2)),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "Use a 3-letter currency code"),
  scope: text("Scope", 3000),
  validUntil: date,
});

export const imageRequestSchema = z.object({
  folder: z.enum(["services", "portfolio", "team"]),
  name: z.string().min(1).max(200),
  type: z.string(),
  size: z.number().int().positive(),
});
