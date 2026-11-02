"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleHelp, FolderKanban, Inbox, LayoutDashboard, Layers, MessageSquareQuote, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/portfolio", label: "Portfolio", icon: FolderKanban },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm whitespace-nowrap transition-colors", active ? "bg-cyan/15 font-semibold text-white" : "text-mist hover:bg-white/5 hover:text-white")}>
            <Icon className="size-4" aria-hidden />{label}
          </Link>
        );
      })}
    </nav>
  );
}
