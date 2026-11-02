import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

export function PageHeader({ title, lead, action }: { title: string; lead?: string; action?: { href: string; label: string } }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
        {lead && <p className="mt-1.5 text-mist">{lead}</p>}
      </div>
      {action && <ButtonLink href={action.href}><Plus className="size-4" aria-hidden />{action.label}</ButtonLink>}
    </header>
  );
}

export function Panel({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-aqua/12 bg-deep/40 p-5 md:p-6", className)}>
      {title && <h2 className="mb-4 font-display text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

const badgeTones: Record<string, string> = {
  New: "bg-cyan/15 text-cyan",
  Reviewing: "bg-amber-300/15 text-amber-200",
  "Quotation Sent": "bg-violet-300/15 text-violet-200",
  Approved: "bg-emerald-300/15 text-emerald-200",
  "In Progress": "bg-sky-300/15 text-sky-200",
  Completed: "bg-emerald-300/15 text-emerald-200",
  Cancelled: "bg-red-300/15 text-red-200",
  pending: "bg-amber-300/15 text-amber-200",
  approved: "bg-emerald-300/15 text-emerald-200",
  rejected: "bg-red-300/15 text-red-200",
  Live: "bg-emerald-300/15 text-emerald-200",
  Hidden: "bg-white/10 text-mist",
  Draft: "bg-white/10 text-mist",
};

export function Badge({ children }: { children: string }) {
  return <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", badgeTones[children] ?? "bg-white/10 text-mist")}>{children}</span>;
}

export function RowLink({ href, title, meta, badge }: { href: string; title: string; meta?: string; badge?: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 hover:bg-white/5">
        <span className="min-w-0">
          <span className="block truncate font-medium">{title}</span>
          {meta && <span className="block truncate text-sm text-mist">{meta}</span>}
        </span>
        {badge && <Badge>{badge}</Badge>}
      </Link>
    </li>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-aqua/20 p-8 text-center text-mist">{children}</p>;
}

export const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Colombo" });
export const dateTimeFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" });
