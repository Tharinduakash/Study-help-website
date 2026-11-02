import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/entity-forms";
import { PageHeader } from "@/components/admin/ui";
import { listCategoryOptions } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "New service" };

export default async function NewServicePage() {
  return (
    <>
      <PageHeader title="New service" />
      <ServiceForm categories={await listCategoryOptions()} />
    </>
  );
}
