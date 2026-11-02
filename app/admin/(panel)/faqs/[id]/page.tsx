import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqForm } from "@/components/admin/entity-forms";
import { ActionButton } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { deleteFaq } from "@/lib/admin/actions";
import { getFaqRow, listCategoryOptions } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = isUuid(id) ? await getFaqRow(id) : null;
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.question} />
      <FaqForm row={row} categories={await listCategoryOptions()} />
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteFaq} fields={{ id: row.id }} label="Delete this FAQ" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
