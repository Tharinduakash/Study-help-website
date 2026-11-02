import type { Metadata } from "next";
import Link from "next/link";
import { inputClass } from "@/components/admin/form";
import { dateFormat, EmptyState, PageHeader, Panel, RowLink } from "@/components/admin/ui";
import { buttonVariants } from "@/components/ui/button";
import { inquiryStatus } from "@/db/schema";
import { INQUIRY_PAGE_SIZE, listInquiries, type InquiryStatus } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Inquiries" };

type Props = { searchParams: Promise<{ status?: string; q?: string; page?: string }> };

export default async function InquiriesPage({ searchParams }: Props) {
  const { status: rawStatus, q, page: rawPage } = await searchParams;
  const status = inquiryStatus.enumValues.find((value) => value === rawStatus) as InquiryStatus | undefined;
  const page = Math.max(1, Number(rawPage) || 1);
  const search = q?.trim().slice(0, 100) ?? "";
  const { rows, total } = await listInquiries({ status, search, page });
  const pages = Math.max(1, Math.ceil(total / INQUIRY_PAGE_SIZE));

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("q", search);
    params.set("page", String(target));
    return `/admin/inquiries?${params}`;
  };

  return (
    <>
      <PageHeader title="Inquiries" lead={`${total} ${total === 1 ? "request" : "requests"}`} />
      <form className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input name="q" type="search" defaultValue={search} placeholder="Search reference, name or email" aria-label="Search inquiries" className={`${inputClass} mt-0 sm:flex-1`} />
        <select name="status" defaultValue={status ?? ""} aria-label="Filter by status" className={`${inputClass} mt-0 sm:w-48`}>
          <option value="" className="text-abyss">All statuses</option>
          {inquiryStatus.enumValues.map((value) => <option key={value} className="text-abyss">{value}</option>)}
        </select>
        <button type="submit" className={buttonVariants({ variant: "outline" })}>Filter</button>
      </form>
      <Panel>
        {rows.length === 0 ? <EmptyState>No inquiries match.</EmptyState> : (
          <ul className="divide-y divide-aqua/10">
            {rows.map((inquiry) => (
              <RowLink key={inquiry.id} href={`/admin/inquiries/${inquiry.id}`} title={`${inquiry.reference} · ${inquiry.name}`} meta={`${inquiry.serviceTitle ?? inquiry.categoryTitle ?? "General inquiry"} · ${dateFormat.format(inquiry.createdAt)}`} badge={inquiry.status} />
            ))}
          </ul>
        )}
      </Panel>
      {pages > 1 && (
        <nav aria-label="Pages" className="mt-6 flex items-center justify-between text-sm">
          {page > 1 ? <Link href={pageHref(page - 1)} className="text-aqua hover:underline">Previous</Link> : <span />}
          <span className="text-mist">Page {page} of {pages}</span>
          {page < pages ? <Link href={pageHref(page + 1)} className="text-aqua hover:underline">Next</Link> : <span />}
        </nav>
      )}
    </>
  );
}
