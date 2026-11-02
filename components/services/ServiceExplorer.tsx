"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Search, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { Service, ServiceCategory } from "@/lib/content/services";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "./ServiceIcon";

const priceText = (service: Service) => (service.pricing.type === "fixed" ? service.pricing.label : "Custom quotation");

function ServiceRow({ category, service, open, onToggle, showCategory = false }: { category: ServiceCategory; service: Service; open: boolean; onToggle: () => void; showCategory?: boolean }) {
  const panelId = `service-${category.slug}-${service.slug}`;
  return (
    <div className={cn("rounded-2xl border transition-colors duration-300", open ? "border-cyan/50 bg-deep/70" : "border-aqua/15 bg-white/3 hover:border-aqua/40")}>
      <h3>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle} className="flex min-h-16 w-full items-center justify-between gap-4 p-4 text-left sm:p-5">
          <span className="min-w-0">
            {showCategory && <span className="mb-1 block text-xs font-bold tracking-[0.14em] text-aqua uppercase">{category.title}</span>}
            <span className="block font-display font-semibold">{service.title}</span>
          </span>
          <ChevronDown className={cn("size-5 shrink-0 text-aqua transition-transform duration-300", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div id={panelId} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="px-4 pb-5 sm:px-5">
              <p className="leading-relaxed text-mist">{service.summary}</p>
              {service.options.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {service.options.map((option) => <li key={option} className="flex gap-2.5 text-sm text-white"><Check className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden />{option}</li>)}
                </ul>
              )}
              <p className="mt-4 font-display text-sm text-aqua">{priceText(service)}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                <ButtonLink href={`/quote?service=${service.slug}`}>Request a Quotation</ButtonLink>
                <Link href={`/services/${category.slug}/${service.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-aqua hover:underline">
                  Full details<ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Search every service, or move between the five areas in one live panel.
export function ServiceExplorer({ categories }: { categories: ServiceCategory[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "");
  const [openService, setOpenService] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const active = categories.find((category) => category.slug === activeSlug) ?? categories[0];
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const searching = words.length > 0;

  const results = useMemo(() => categories.flatMap((category) => category.services
    .filter((service) => {
      const haystack = [service.title, service.summary, category.title, ...service.options].join(" ").toLowerCase();
      return words.every((word) => haystack.includes(word));
    })
    .map((service) => ({ category, service }))), [categories, words]);

  const toggle = (key: string) => setOpenService((current) => (current === key ? null : key));

  function chooseCategory(slug: string, target: HTMLElement) {
    setActiveSlug(slug);
    setOpenService(null);
    setQuery("");
    target.scrollIntoView({ inline: "center", block: "nearest" });
  }

  if (!active) return null;

  return (
    <>
      <div className="relative mb-8 max-w-2xl">
        <Search className="pointer-events-none absolute top-1/2 left-5 z-10 size-5 -translate-y-1/2 text-aqua" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpenService(null); }}
          placeholder="What do you need help with?"
          aria-label="Search all services"
          className="glass h-14 w-full rounded-full pr-14 pl-13 text-base text-white placeholder:text-mist/70 focus:border-cyan focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-mist hover:text-white">
            <X className="size-5" aria-hidden />
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-10">
        <nav aria-label="Service areas" className="no-scrollbar sticky top-18 z-30 -mx-4 flex gap-2 overflow-x-auto bg-abyss/90 px-4 py-2 backdrop-blur-lg sm:-mx-6 sm:px-6 lg:top-24 lg:mx-0 lg:flex-col lg:gap-1 lg:self-start lg:overflow-visible lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          {categories.map((category) => {
            const selected = !searching && category.slug === active.slug;
            return (
              <button
                key={category.slug}
                type="button"
                aria-pressed={selected}
                onClick={(event) => chooseCategory(category.slug, event.currentTarget)}
                className={cn("relative flex min-h-11 shrink-0 items-center gap-3 rounded-full border px-4 text-left text-sm whitespace-nowrap transition-colors lg:min-h-16 lg:rounded-2xl lg:border-transparent lg:whitespace-normal", selected ? "border-cyan text-white" : "border-aqua/20 text-mist hover:text-white")}
              >
                {selected && <motion.span layoutId="service-area" aria-hidden className="absolute inset-0 rounded-full bg-cyan/15 lg:rounded-2xl lg:border lg:border-cyan/50" transition={{ type: "spring", stiffness: 320, damping: 32 }} />}
                <ServiceIcon name={category.icon} className="relative size-5 shrink-0 text-aqua" />
                <span className="relative font-semibold lg:font-display">{category.title}</span>
                <span className="relative ml-auto hidden text-xs text-mist lg:inline">{category.services.length}</span>
              </button>
            );
          })}
        </nav>

        <div aria-live="polite" className="min-w-0">
          {searching ? (
            <>
              <p className="mb-4 text-mist">{results.length} {results.length === 1 ? "service matches" : "services match"} your search</p>
              {results.length > 0 ? (
                <div className="grid items-start gap-3 xl:grid-cols-2">
                  {results.map(({ category, service }) => {
                    const key = `${category.slug}/${service.slug}`;
                    return <ServiceRow key={key} category={category} service={service} open={openService === key} onToggle={() => toggle(key)} showCategory />;
                  })}
                </div>
              ) : (
                <div className="glass rounded-3xl p-8 text-center">
                  <p className="font-display text-xl font-semibold">Not sure which service fits?</p>
                  <p className="mt-2 text-mist">Tell us what you need and we will point you in the right direction.</p>
                  <ButtonLink href="/quote" className="mt-6">Ask Us</ButtonLink>
                </div>
              )}
            </>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active.slug} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                <div className="relative isolate flex min-h-72 flex-col justify-end overflow-hidden rounded-3xl border border-aqua/15 bg-deep p-6 sm:min-h-80 sm:p-8">
                  {active.imageUrl && <Image src={active.imageUrl} alt="" fill priority sizes="(min-width: 1024px) 70vw, 100vw" className="-z-20 object-cover" />}
                  <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-abyss via-abyss/75 to-abyss/10" />
                  <p className="text-xs font-bold tracking-[0.18em] text-aqua uppercase">Area {active.number}</p>
                  <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">{active.title}</h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-white/85">{active.description}</p>
                </div>

                <div className="mt-6 grid items-start gap-3 xl:grid-cols-2">
                  {active.services.map((service) => {
                    const key = `${active.slug}/${service.slug}`;
                    return <ServiceRow key={key} category={active} service={service} open={openService === key} onToggle={() => toggle(key)} />;
                  })}
                </div>

                {active.deliverables.length > 0 && (
                  <div className="mt-6 rounded-3xl border border-aqua/15 bg-white/3 p-6 sm:p-7">
                    <h3 className="font-display text-lg font-semibold">What you receive</h3>
                    <ul className="mt-4 grid gap-3 md:grid-cols-3">
                      {active.deliverables.map((item) => <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-mist"><Check className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden />{item}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <ButtonLink href={`/quote?category=${active.slug}`}>Start a Project</ButtonLink>
                  <Link href={`/services/${active.slug}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-aqua hover:underline">
                    Explore this area<ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}
