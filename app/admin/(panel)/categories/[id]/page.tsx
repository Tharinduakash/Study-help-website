import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/entity-forms";
import { ActionButton } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { deleteCategory } from "@/lib/admin/actions";
import { getCategory } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = isUuid(id) ? await getCategory(id) : null;
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.title} />
      <CategoryForm row={row} />
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteCategory} fields={{ id: row.id }} label="Delete this category" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
