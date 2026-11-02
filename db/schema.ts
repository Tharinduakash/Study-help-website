import { sql } from "drizzle-orm";
import { boolean, check, date, index, integer, jsonb, numeric, pgEnum, pgSequence, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

export const pricingType = pgEnum("pricing_type", ["quote", "fixed"]);
export const inquirySource = pgEnum("inquiry_source", ["quote", "contact"]);
export const inquiryStatus = pgEnum("inquiry_status", ["New", "Reviewing", "Quotation Sent", "Approved", "In Progress", "Completed", "Cancelled"]);
export const testimonialStatus = pgEnum("testimonial_status", ["pending", "approved", "rejected"]);

export const inquiryReferenceSeq = pgSequence("inquiry_reference_seq", { startWith: 1 });

const id = () => uuid("id").primaryKey().defaultRandom();
const textList = (name: string) => text(name).array().notNull().default(sql`'{}'::text[]`);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date());

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const sessions = pgTable("sessions", {
  // SHA-256 of the cookie value, so a database leak cannot be replayed as a login.
  tokenHash: text("token_hash").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
}, (table) => [index("sessions_user_idx").on(table.userId)]);

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export const serviceCategories = pgTable("service_categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  short: text("short").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull().default("chart"),
  imageUrl: text("image_url"),
  deliverables: textList("deliverables"),
  note: text("note"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [index("service_categories_active_idx").on(table.isActive, table.sortOrder)]);

export const services = pgTable("services", {
  id: id(),
  categoryId: uuid("category_id").notNull().references(() => serviceCategories.id, { onDelete: "restrict" }),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  options: textList("options"),
  pricingType: pricingType("pricing_type").notNull().default("quote"),
  priceLabel: text("price_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  uniqueIndex("services_category_slug_idx").on(table.categoryId, table.slug),
  index("services_active_idx").on(table.categoryId, table.isActive, table.sortOrder),
  check("services_fixed_needs_label", sql`${table.pricingType} <> 'fixed' or ${table.priceLabel} is not null`),
]);

export const portfolioProjects = pgTable("portfolio_projects", {
  id: id(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  serviceCategoryId: uuid("service_category_id").references(() => serviceCategories.id, { onDelete: "set null" }),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  tags: textList("tags"),
  outcomes: textList("outcomes"),
  deliverables: textList("deliverables"),
  coverVariant: text("cover_variant").notNull().default("dashboard"),
  coverImageUrl: text("cover_image_url"),
  videoUrl: text("video_url"),
  isSample: boolean("is_sample").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("portfolio_published_idx").on(table.isPublished, table.sortOrder),
  index("portfolio_service_category_idx").on(table.serviceCategoryId),
]);

export const portfolioImages = pgTable("portfolio_images", {
  id: id(),
  projectId: uuid("project_id").notNull().references(() => portfolioProjects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: text("alt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: createdAt(),
}, (table) => [index("portfolio_images_project_idx").on(table.projectId, table.sortOrder)]);

export const teamMembers = pgTable("team_members", {
  id: id(),
  name: text("name").notNull().default(""),
  designation: text("designation").notNull(),
  bio: text("bio").notNull(),
  skills: textList("skills"),
  imageUrl: text("image_url"),
  links: jsonb("links").$type<{ label: string; href: string }[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [index("team_members_active_idx").on(table.isActive, table.sortOrder)]);

export const inquiries = pgTable("inquiries", {
  id: id(),
  reference: text("reference").notNull().unique(),
  source: inquirySource("source").notNull().default("quote"),
  categoryId: uuid("category_id").references(() => serviceCategories.id, { onDelete: "set null" }),
  serviceId: uuid("service_id").references(() => services.id, { onDelete: "set null" }),
  // Kept as text so an inquiry still reads correctly after a service is renamed or deleted.
  categoryTitle: text("category_title"),
  serviceTitle: text("service_title"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  deadline: date("deadline"),
  status: inquiryStatus("status").notNull().default("New"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("inquiries_status_idx").on(table.status, table.createdAt),
  index("inquiries_created_idx").on(table.createdAt),
  index("inquiries_email_idx").on(table.email),
]);

export const inquiryAttachments = pgTable("inquiry_attachments", {
  id: id(),
  inquiryId: uuid("inquiry_id").notNull().references(() => inquiries.id, { onDelete: "cascade" }),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path").notNull().unique(),
  sizeBytes: integer("size_bytes").notNull(),
  contentType: text("content_type"),
  createdAt: createdAt(),
}, (table) => [index("inquiry_attachments_inquiry_idx").on(table.inquiryId)]);

export const inquiryNotes = pgTable("inquiry_notes", {
  id: id(),
  inquiryId: uuid("inquiry_id").notNull().references(() => inquiries.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull(),
  createdAt: createdAt(),
}, (table) => [index("inquiry_notes_inquiry_idx").on(table.inquiryId, table.createdAt)]);

export const quotations = pgTable("quotations", {
  id: id(),
  inquiryId: uuid("inquiry_id").notNull().references(() => inquiries.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("LKR"),
  scope: text("scope").notNull(),
  validUntil: date("valid_until"),
  createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
}, (table) => [
  index("quotations_inquiry_idx").on(table.inquiryId, table.createdAt),
  check("quotations_amount_positive", sql`${table.amount} >= 0`),
]);

export const testimonials = pgTable("testimonials", {
  id: id(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  service: text("service").notNull(),
  rating: integer("rating").notNull(),
  status: testimonialStatus("status").notNull().default("pending"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [
  index("testimonials_status_idx").on(table.status, table.createdAt),
  check("testimonials_rating_range", sql`${table.rating} between 1 and 5`),
]);

export const faqs = pgTable("faqs", {
  id: id(),
  // Null means a general FAQ; otherwise it appears on that category's service pages.
  categoryId: uuid("category_id").references(() => serviceCategories.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}, (table) => [index("faqs_category_idx").on(table.categoryId, table.isActive, table.sortOrder)]);

export const websiteSettings = pgTable("website_settings", {
  key: text("key").notNull(),
  value: jsonb("value").notNull(),
  updatedAt: updatedAt(),
}, (table) => [primaryKey({ columns: [table.key] })]);
