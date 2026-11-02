"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderKanban, House, Layers, MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: House },
  { href: "/services", label: "Services", icon: Layers },
  { href: "/quote", label: "Quote", icon: Send, primary: true },
  { href: "/portfolio", label: "Work", icon: FolderKanban },
  { href: "/contact", label: "Contact", icon: MessageCircle },
];

// App-style navigation for phones. Tablets and larger keep the top bar.
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-aqua/15 bg-abyss/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex">
              <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors", active ? "text-aqua" : "text-mist")}>
                {primary ? (
                  <span className="-mt-7 grid size-13 place-items-center rounded-full bg-gradient-to-br from-cyan to-aqua text-abyss shadow-lg shadow-cyan/30 ring-4 ring-abyss"><Icon className="size-5" aria-hidden /></span>
                ) : (
                  <Icon className="size-5" aria-hidden />
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
