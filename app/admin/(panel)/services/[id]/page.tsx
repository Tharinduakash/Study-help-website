import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/entity-forms";
import { ActionButton } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { deleteService } from "@/lib/admin/actions";
import { getServiceRow, listCategoryOptions } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = isUuid(id) ? await getServiceRow(id) : null;
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.title} />
      <ServiceForm row={row} categories={await listCategoryOptions()} />
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteService} fields={{ id: row.id }} label="Delete this service" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
