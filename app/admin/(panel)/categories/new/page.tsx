import type { Metadata } from "next";
import { CategoryForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "New category" };

export default async function NewCategoryPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="New category" />
      <CategoryForm />
    </>
  );
}
