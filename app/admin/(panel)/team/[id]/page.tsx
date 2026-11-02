import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamForm } from "@/components/admin/entity-forms";
import { ActionButton } from "@/components/admin/form";
import { PageHeader } from "@/components/admin/ui";
import { deleteTeamMember } from "@/lib/admin/actions";
import { getTeamRow } from "@/lib/admin/queries";
import { isUuid } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit team member" };

export default async function EditTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = isUuid(id) ? await getTeamRow(id) : null;
  if (!row) notFound();

  return (
    <>
      <PageHeader title={row.name || row.designation} />
      <TeamForm row={row} />
      <div className="mt-10 border-t border-aqua/10 pt-6">
        <ActionButton action={deleteTeamMember} fields={{ id: row.id }} label="Delete this team member" confirm="Delete permanently? This cannot be undone." tone="danger" />
      </div>
    </>
  );
}
