import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge, PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { listCategoriesWithServices } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const categories = await listCategoriesWithServices();
  return (
    <>
      <PageHeader title="Services" lead="Hidden items stay in the system but disappear from the public site." action={{ href: "/admin/services/new", label: "New service" }} />
      <Link href="/admin/categories/new" className="mb-6 inline-flex items-center gap-1.5 text-sm text-aqua hover:underline"><Plus className="size-4" aria-hidden />New category</Link>
      <div className="space-y-6">
        {categories.map((category) => (
          <Panel key={category.id}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-3">
              <h2 className="font-display text-lg font-semibold">{category.title}</h2>
              <span className="flex items-center gap-3">
                <Badge>{category.isActive ? "Live" : "Hidden"}</Badge>
                <Link href={`/admin/categories/${category.id}`} className="text-sm text-aqua hover:underline">Edit category</Link>
              </span>
            </div>
            <ul className="divide-y divide-aqua/10">
              {category.services.map((service) => (
                <RowLink key={service.id} href={`/admin/services/${service.id}`} title={service.title} meta={service.pricingType === "fixed" ? service.priceLabel ?? "" : "Custom quotation"} badge={service.isActive ? "Live" : "Hidden"} />
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </>
  );
}
