"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LoaderCircle, MessageCircle, TriangleAlert } from "lucide-react";
import { prepareInquiryUploads, submitInquiry } from "@/lib/inquiry-actions";
import { ALLOWED_EXTENSIONS, MAX_FILES, fileError, inquirySchema, type InquiryState } from "@/lib/inquiry-schema";
import type { ServiceCategory } from "@/lib/content/services";
import { whatsappLink } from "@/lib/site-config";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass = "mt-1.5 w-full rounded-xl border border-aqua/20 bg-white/5 px-4 py-3 text-white placeholder:text-mist/60 focus:border-cyan focus:outline-none";

function Field({ label, name, error, children }: { label: string; name: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-sm text-red-300">{error}</p>}
    </div>
  );
}

type Props = { categories: ServiceCategory[]; whatsappNumber: string; compact?: boolean };

export function InquiryForm({ categories, whatsappNumber, compact = false }: Props) {
  const params = useSearchParams();
  const initialService = params.get("service") ?? "";
  const initialCategory = categories.find((category) => category.services.some((service) => service.slug === initialService))?.slug ?? params.get("category") ?? "";

  const [state, action, submitting] = useActionState<InquiryState, FormData>(submitInquiry, { status: "idle" });
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [serviceSlug, setServiceSlug] = useState(initialService);
  const [clientErrors, setClientErrors] = useState<Record<string, string | undefined>>({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const selectedCategory = categories.find((category) => category.slug === categorySlug);
  const services = selectedCategory?.services ?? [];
  const selectedService = services.find((service) => service.slug === serviceSlug)?.title ?? selectedCategory?.title;
  const errors = { ...(state.status === "invalid" ? state.errors : {}), ...clientErrors };
  const pending = submitting || uploading;
  const failure = uploadError || (state.status === "error" ? state.message : "");
  const fallback = whatsappLink(whatsappNumber, `Hi Study Help, I would like to ask about ${selectedService ?? "a project"}.`);

  // Runs first for instant feedback; the server action repeats every check.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parsed = inquirySchema.safeParse({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone") || undefined,
      message: data.get("message"),
    });
    const next: Record<string, string | undefined> = {};
    if (!parsed.success) for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;

    const files = data.getAll("files").filter((file): file is File => file instanceof File && file.size > 0);
    const problem = files.length > MAX_FILES ? `Attach up to ${MAX_FILES} files` : files.map(fileError).find(Boolean);
    if (problem) next.files = problem;

    setClientErrors(next);
    setUploadError("");
    if (Object.keys(next).length > 0) return;

    data.delete("files");
    if (files.length > 0) {
      setUploading(true);
      try {
        const ticket = await prepareInquiryUploads(files.map(({ name, size }) => ({ name, size })));
        if ("error" in ticket) throw new Error(ticket.error);
        await Promise.all(ticket.uploads.map(async ({ signedUrl }, index) => {
          const response = await fetch(signedUrl, { method: "PUT", body: files[index], headers: { "Content-Type": files[index].type || "application/octet-stream" } });
          if (!response.ok) throw new Error(`${files[index].name} could not be uploaded. Please try again.`);
        }));
        data.set("uploadId", ticket.uploadId);
      } catch (error) {
        setUploadError(error instanceof Error ? error.message : "Your files could not be uploaded. Please try again.");
        return;
      } finally {
        setUploading(false);
      }
    }
    startTransition(() => action(data));
  }

  if (state.status === "success") {
    const whatsapp = whatsappLink(whatsappNumber, `Hi Study Help, my inquiry reference is ${state.reference}${selectedService ? ` (${selectedService})` : ""}.`);
    return (
      <div role="status" className="glass rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto size-10 text-aqua" aria-hidden />
        <h2 className="mt-4 font-display text-2xl font-semibold">We have received your request.</h2>
        <p className="mt-3 text-mist">Your reference is</p>
        <p className="mt-1 font-display text-2xl font-semibold text-aqua">{state.reference}</p>
        <p className="mt-3 text-mist">Keep this reference. We will review your requirements and reply using the details you gave us.</p>
        {whatsapp && (
          <a href={whatsapp} target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
            <MessageCircle className="size-4" aria-hidden />Continue on WhatsApp
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <input type="hidden" name="source" value={compact ? "contact" : "quote"} />
      <div aria-hidden className="absolute -left-[9999px]">
        <label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {!compact && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Service category" name="category">
            <select id="category" name="category" value={categorySlug} onChange={(event) => { setCategorySlug(event.target.value); setServiceSlug(""); }} className={fieldClass}>
              <option value="" className="text-abyss">Select a category</option>
              {categories.map((category) => <option key={category.slug} value={category.slug} className="text-abyss">{category.title}</option>)}
            </select>
          </Field>
          <Field label="Specific service" name="service">
            <select id="service" name="service" value={serviceSlug} onChange={(event) => setServiceSlug(event.target.value)} disabled={services.length === 0} className={fieldClass}>
              <option value="" className="text-abyss">Select a service</option>
              {services.map((service) => <option key={service.slug} value={service.slug} className="text-abyss">{service.title}</option>)}
            </select>
          </Field>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" error={errors.name}>
          <input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} className={fieldClass} />
        </Field>
        <Field label="Email" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className={fieldClass} />
        </Field>
      </div>
      <div className={cn("grid gap-5", !compact && "sm:grid-cols-2")}>
        <Field label="Contact number" name="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
        </Field>
        {!compact && (
          <Field label="Preferred deadline" name="deadline" error={errors.deadline}>
            <input id="deadline" name="deadline" type="date" className={cn(fieldClass, "[color-scheme:dark]")} />
          </Field>
        )}
      </div>
      <Field label={compact ? "Message" : "Your requirements"} name="message" error={errors.message}>
        <textarea id="message" name="message" rows={6} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} className={fieldClass} />
      </Field>
      {!compact && (
        <Field label="Reference files (optional)" name="files" error={errors.files}>
          <input id="files" name="files" type="file" multiple accept={ALLOWED_EXTENSIONS.join(",")} className={cn(fieldClass, "file:mr-3 file:rounded-full file:border-0 file:bg-cyan file:px-3 file:py-1 file:text-sm file:font-semibold file:text-abyss")} />
          <p className="mt-1.5 text-xs text-mist">Up to {MAX_FILES} files, 10 MB each. Your files stay private.</p>
        </Field>
      )}
      {failure && (
        <div role="alert" className="flex gap-3 rounded-xl border border-amber-300/40 bg-amber-300/10 p-4 text-sm text-amber-100">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{failure}{fallback && <> You can also <a href={fallback} className="underline">message us on WhatsApp</a>.</>}</p>
        </div>
      )}
      <button type="submit" disabled={pending} className={buttonVariants({ size: "lg" })}>
        {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
        {uploading ? "Uploading files..." : compact ? "Send Message" : "Submit Your Request"}
      </button>
    </form>
  );
}
