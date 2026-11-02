import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/admin/entity-forms";
import { ActionButton } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { deleteTestimonial } from "@/lib/admin/actions";
import { getTestimonialRow } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit review" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = isUuid(id) ? await getTestimonialRow(id) : null;
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.name} />
      <TestimonialForm row={row} />
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteTestimonial} fields={{ id: row.id }} label="Delete this review" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
