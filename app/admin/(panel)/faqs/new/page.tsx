import type { Metadata } from "next";
import { FaqForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { listCategoryOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "New FAQ" };

export default async function NewFaqPage() {
  return (
    <>
      <PageHeader title="New FAQ" />
      <FaqForm categories={await listCategoryOptions()} />
    </>
  );
}
