import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New review" };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New review" />
      <TestimonialForm />
    </>
  );
}
