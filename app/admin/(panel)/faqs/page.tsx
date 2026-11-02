import type { Metadata } from "next";
import { PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { listFaqs } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "FAQs" };

export default async function FaqsAdminPage() {
  const rows = await listFaqs();
  return (
    <>
      <PageHeader title="FAQs" action={{ href: "/admin/faqs/new", label: "New FAQ" }} />
      <Panel>
        <ul className="divide-y divide-aqua/10">
          {rows.map(({ faq, category }) => (
            <RowLink key={faq.id} href={`/admin/faqs/${faq.id}`} title={faq.question} meta={category ?? "Homepage and FAQ page"} badge={faq.isActive ? "Live" : "Hidden"} />
          ))}
        </ul>
      </Panel>
    </>
  );
}
