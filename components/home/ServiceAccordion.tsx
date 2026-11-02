"use client";

import { useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import type { ServiceCategory } from "@/lib/content/services";
import { cn } from "@/lib/utils";

// Five image panels. A closed panel is a button that opens in place; only an open panel
// holds the link, so one tap can never both open a panel and leave the page.
export function ServiceAccordion({ categories }: { categories: ServiceCategory[] }) {
  const [active, setActive] = useState(0);

  // Hover only opens panels in the wide layout. In the stacked layout it would shift the page under the pointer.
  const onEnter = (event: PointerEvent, index: number) => {
    if (event.pointerType === "mouse" && window.matchMedia("(min-width: 64rem)").matches) setActive(index);
  };

  return (
    <div className="flex h-[52rem] flex-col gap-2.5 sm:h-[46rem] lg:h-[34rem] lg:flex-row lg:gap-3">
      {categories.map((category, index) => {
        const open = active === index;
        const panelId = `service-area-${category.slug}`;
        return (
          <motion.article
            key={category.slug}
            initial={{ opacity: 0, y: 70 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.75, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
            onPointerEnter={(event) => onEnter(event, index)}
            style={{ flexGrow: open ? 4.6 : 1 }}
            className={cn("relative isolate min-h-0 min-w-0 basis-0 overflow-hidden rounded-3xl border transition-[flex-grow,border-color] duration-500 ease-out", open ? "border-cyan/60" : "border-aqua/15")}
          >
            {category.imageUrl && <Image src={category.imageUrl} alt="" fill sizes="(min-width: 1024px) 45vw, 100vw" className={cn("-z-20 object-cover transition-transform duration-700 motion-reduce:transform-none", open ? "scale-100" : "scale-110")} />}
            <div aria-hidden className={cn("absolute inset-0 -z-10 transition-colors duration-500", open ? "bg-linear-to-t from-abyss from-35% via-abyss/75 via-65% to-abyss/10" : "bg-abyss/75")} />

            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setActive(index)}
              className={cn("absolute inset-0 flex w-full items-center gap-3 p-5 text-left transition-opacity duration-300 lg:flex-col lg:justify-end lg:px-0 lg:py-6", open ? "invisible opacity-0" : "opacity-100")}
            >
              <ServiceIcon name={category.icon} className="size-5 shrink-0 text-aqua lg:order-last" />
              <span className="font-display font-semibold whitespace-nowrap lg:rotate-180 lg:[writing-mode:vertical-rl]">{category.title}</span>
            </button>

            {/* On desktop the whole open panel is clickable. The visible link stays the keyboard route. */}
            {open && <Link href={`/services/${category.slug}`} tabIndex={-1} aria-hidden className="absolute inset-0 hidden lg:block" />}

            <div id={panelId} className={cn("absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300 sm:p-8 lg:right-auto lg:w-[28rem]", open ? "opacity-100 delay-150" : "invisible opacity-0")}>
              <p className="text-xs font-bold tracking-[0.18em] text-aqua uppercase">Area {category.number}</p>
              <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{category.title}</h3>
              <p className="mt-2 leading-relaxed text-white/85">{category.short}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5 sm:mt-4 sm:gap-2">
                {category.services.slice(0, 3).map((service) => <li key={service.slug} className="rounded-full border border-aqua/25 bg-abyss/50 px-2.5 py-1 text-xs text-mist">{service.title}</li>)}
              </ul>
              <Link href={`/services/${category.slug}`} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-aqua hover:underline">
                Discover more<ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
