import type { Metadata } from "next";
import { ProjectForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { listCategoryOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  return (
    <>
      <PageHeader title="New project" />
      <ProjectForm categories={await listCategoryOptions()} />
    </>
  );
}
