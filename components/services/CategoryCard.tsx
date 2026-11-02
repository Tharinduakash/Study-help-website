import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceCategory } from "@/lib/content/services";
import { cn } from "@/lib/utils";
import { ServiceIcon } from "./ServiceIcon";

export function CategoryCard({ category, wide = false }: { category: ServiceCategory; wide?: boolean }) {
  return (
    <Link href={`/services/${category.slug}`} className="glass glow-hover group flex h-full flex-col overflow-hidden rounded-2xl">
      {category.imageUrl && (
        <div className={cn("relative aspect-[16/10] overflow-hidden", wide && "md:aspect-[21/8] lg:aspect-[16/10]")}>
          <Image src={category.imageUrl} alt="" fill sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
      <div className="flex items-start justify-between">
        <span className="grid size-12 place-items-center rounded-xl bg-cyan/12 text-aqua">
          <ServiceIcon name={category.icon} className="size-6" />
        </span>
        <span className="font-display text-sm text-aqua/70">{category.number}</span>
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold">{category.title}</h3>
      <p className="mt-3 leading-relaxed text-mist">{category.short}</p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {category.services.slice(0, 3).map((service) => (
          <li key={service.slug} className="rounded-full border border-aqua/15 px-3 py-1 text-xs text-mist">{service.title}</li>
        ))}
      </ul>
      <span className="mt-auto flex items-center gap-1.5 pt-6 text-sm font-semibold text-aqua">
        Discover more
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </span>
      </div>
    </Link>
  );
}
