"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { ButtonLink } from "@/components/ui/button";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState({ open: false, path: pathname });
  // Navigating closes the menu: it only counts as open for the page it opened on.
  const open = menu.open && menu.path === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenu((current) => ({ ...current, open: false }));
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", open ? "bg-abyss" : scrolled ? "border-b border-aqua/10 bg-abyss/85 backdrop-blur-xl" : "bg-transparent")}>
      <nav aria-label="Main" className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <ul className="hidden items-center gap-6 lg:flex xl:gap-7 2xl:gap-9 3xl:gap-11">
          {navLinks.map((link) => (
            <li key={link.href} className="relative">
              <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={cn("text-sm font-medium transition-colors hover:text-white xl:text-[15px] 2xl:text-base 3xl:text-lg", isActive(link.href) ? "text-white" : "text-mist")}>
                {link.label}
              </Link>
              {isActive(link.href) && <motion.span layoutId="nav-active" className="absolute inset-x-0 -bottom-1.5 h-0.5 rounded bg-cyan" />}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ButtonLink href="/quote" className="hidden md:inline-flex">Get a Quote</ButtonLink>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setMenu({ open: !open, path: pathname })}
          >
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100dvh - 4.5rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col overflow-hidden bg-[radial-gradient(120%_70%_at_100%_0%,rgb(8_123_191/0.35),transparent)] lg:hidden"
          >
            <ul className="flex-1 overflow-y-auto px-4 pt-4 sm:px-6 md:pt-8">
              {navLinks.map((link, index) => (
                <motion.li key={link.href} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 + index * 0.05 }} className="border-b border-aqua/10">
                  <Link href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={cn("flex items-center gap-4 py-3 font-display text-lg font-medium sm:py-3.5 sm:text-xl md:py-4 md:text-2xl", isActive(link.href) ? "text-aqua" : "text-white")}>
                    <span aria-hidden className="w-6 text-xs text-aqua/70">0{index + 1}</span>
                    {link.label}
                    <ArrowUpRight className="ml-auto size-5 text-aqua/70" aria-hidden />
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 md:hidden"><ButtonLink href="/quote" size="lg" className="w-full">Get a Quote</ButtonLink></div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
