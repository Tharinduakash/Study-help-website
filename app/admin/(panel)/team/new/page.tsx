import type { Metadata } from "next";
import { TeamForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New team member" };

export default async function NewTeamPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New team member" />
      <TeamForm />
    </>
  );
}
