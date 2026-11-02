CREATE TYPE "public"."inquiry_source" AS ENUM('quote', 'contact');--> statement-breakpoint
CREATE TYPE "public"."inquiry_status" AS ENUM('New', 'Reviewing', 'Quotation Sent', 'Approved', 'In Progress', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."pricing_type" AS ENUM('quote', 'fixed');--> statement-breakpoint
CREATE TYPE "public"."testimonial_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE SEQUENCE "public"."inquiry_reference_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"source" "inquiry_source" DEFAULT 'quote' NOT NULL,
	"category_id" uuid,
	"service_id" uuid,
	"category_title" text,
	"service_title" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"deadline" date,
	"status" "inquiry_status" DEFAULT 'New' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiries_reference_unique" UNIQUE("reference")
);
--> statement-breakpoint
CREATE TABLE "inquiry_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"content_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiry_attachments_storage_path_unique" UNIQUE("storage_path")
);
--> statement-breakpoint
CREATE TABLE "inquiry_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"author_id" uuid,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"service_category_id" uuid,
	"summary" text NOT NULL,
	"description" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"outcomes" text[] DEFAULT '{}'::text[] NOT NULL,
	"deliverables" text[] DEFAULT '{}'::text[] NOT NULL,
	"cover_variant" text DEFAULT 'dashboard' NOT NULL,
	"cover_image_url" text,
	"video_url" text,
	"is_sample" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" text DEFAULT 'LKR' NOT NULL,
	"scope" text NOT NULL,
	"valid_until" date,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "quotations_amount_positive" CHECK ("quotations"."amount" >= 0)
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "service_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"short" text NOT NULL,
	"description" text NOT NULL,
	"icon" text DEFAULT 'chart' NOT NULL,
	"image_url" text,
	"deliverables" text[] DEFAULT '{}'::text[] NOT NULL,
	"note" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "service_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"description" text,
	"image_url" text,
	"options" text[] DEFAULT '{}'::text[] NOT NULL,
	"pricing_type" "pricing_type" DEFAULT 'quote' NOT NULL,
	"price_label" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_fixed_needs_label" CHECK ("services"."pricing_type" <> 'fixed' or "services"."price_label" is not null)
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token_hash" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"designation" text NOT NULL,
	"bio" text NOT NULL,
	"skills" text[] DEFAULT '{}'::text[] NOT NULL,
	"image_url" text,
	"links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quote" text NOT NULL,
	"name" text NOT NULL,
	"service" text NOT NULL,
	"rating" integer NOT NULL,
	"status" "testimonial_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "testimonials_rating_range" CHECK ("testimonials"."rating" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "website_settings" (
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "website_settings_key_pk" PRIMARY KEY("key")
);
--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_attachments" ADD CONSTRAINT "inquiry_attachments_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_notes" ADD CONSTRAINT "inquiry_notes_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_notes" ADD CONSTRAINT "inquiry_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_images" ADD CONSTRAINT "portfolio_images_project_id_portfolio_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."portfolio_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD CONSTRAINT "portfolio_projects_service_category_id_service_categories_id_fk" FOREIGN KEY ("service_category_id") REFERENCES "public"."service_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_service_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."service_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faqs_category_idx" ON "faqs" USING btree ("category_id","is_active","sort_order");--> statement-breakpoint
CREATE INDEX "inquiries_status_idx" ON "inquiries" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "inquiries_created_idx" ON "inquiries" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inquiries_email_idx" ON "inquiries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "inquiry_attachments_inquiry_idx" ON "inquiry_attachments" USING btree ("inquiry_id");--> statement-breakpoint
CREATE INDEX "inquiry_notes_inquiry_idx" ON "inquiry_notes" USING btree ("inquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "portfolio_images_project_idx" ON "portfolio_images" USING btree ("project_id","sort_order");--> statement-breakpoint
CREATE INDEX "portfolio_published_idx" ON "portfolio_projects" USING btree ("is_published","sort_order");--> statement-breakpoint
CREATE INDEX "portfolio_service_category_idx" ON "portfolio_projects" USING btree ("service_category_id");--> statement-breakpoint
CREATE INDEX "quotations_inquiry_idx" ON "quotations" USING btree ("inquiry_id","created_at");--> statement-breakpoint
CREATE INDEX "service_categories_active_idx" ON "service_categories" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE UNIQUE INDEX "services_category_slug_idx" ON "services" USING btree ("category_id","slug");--> statement-breakpoint
CREATE INDEX "services_active_idx" ON "services" USING btree ("category_id","is_active","sort_order");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "team_members_active_idx" ON "team_members" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "testimonials_status_idx" ON "testimonials" USING btree ("status","created_at");