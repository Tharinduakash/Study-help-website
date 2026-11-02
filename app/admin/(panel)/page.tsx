import { dateFormat, EmptyState, PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { getDashboard } from "@/lib/admin/queries";
import Link from "next/link";

export default async function DashboardPage() {
  const data = await getDashboard();
  const stats = [
    { label: "Total inquiries", value: data.total, href: "/admin/inquiries" },
    { label: "New inquiries", value: data.newInquiries, href: "/admin/inquiries?status=New" },
    { label: "Active projects", value: data.active, href: "/admin/inquiries?status=In+Progress" },
    { label: "Completed projects", value: data.completed, href: "/admin/inquiries?status=Completed" },
    { label: "Portfolio projects", value: data.portfolio, href: "/admin/portfolio" },
    { label: "Reviews to approve", value: data.pendingReviews, href: "/admin/testimonials" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-2xl border border-aqua/12 bg-deep/40 p-5 transition-colors hover:border-aqua/40">
            <p className="font-display text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-mist">{stat.label}</p>
          </Link>
        ))}
      </div>
      <Panel title="Latest inquiries" className="mt-8">
        {data.recent.length === 0 ? <EmptyState>No inquiries yet. New requests will appear here.</EmptyState> : (
          <ul className="divide-y divide-aqua/10">
            {data.recent.map((inquiry) => (
              <RowLink key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} title={`${inquiry.reference} · ${inquiry.name}`} meta={`${inquiry.serviceTitle ?? inquiry.categoryTitle ?? "General inquiry"} · ${dateFormat.format(inquiry.createdAt)}`} badge={inquiry.status} />
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
