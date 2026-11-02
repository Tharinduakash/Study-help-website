import type { ReactNode } from "react";
import Image from "next/image";
import { getSiteSettings } from "@/lib/data";
import type { PageBanner } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Reveal, RevealHeading } from "./Reveal";

type SectionProps = {
  id?: string;
  tone?: "abyss" | "deep" | "light";
  eyebrow?: string;
  title?: string;
  lead?: string;
  children: ReactNode;
};

const tones = {
  abyss: "bg-abyss text-white",
  deep: "bg-gradient-to-b from-abyss via-deep/70 to-abyss text-white",
  light: "bg-foam text-abyss",
};

export function Section({ id, tone = "abyss", eyebrow, title, lead, children }: SectionProps) {
  const light = tone === "light";
  return (
    <section id={id} className={cn("scroll-mt-20 px-4 py-14 sm:px-6 sm:py-20 lg:py-28", tones[tone])}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <div className="mb-8 max-w-2xl md:mb-12 lg:mb-16">
            {eyebrow && (
              <Reveal effect="left"><p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.22em]", light ? "text-ocean" : "text-aqua")}>{eyebrow}</p></Reveal>
            )}
            <RevealHeading text={title} className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.12]" />
            {lead && <Reveal effect="blur" delay={0.25}><p className={cn("mt-4 text-lg leading-relaxed", light ? "text-deep/75" : "text-mist")}>{lead}</p></Reveal>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export async function PageHero({ eyebrow, title, lead, image, banner = "pageHeroImageUrl", children }: { eyebrow: string; title: string; lead?: string; image?: string | null; banner?: PageBanner; children?: ReactNode }) {
  const background = image ?? (await getSiteSettings())[banner];
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-deep to-abyss px-4 pt-28 pb-12 sm:px-6 md:pt-40 md:pb-20 lg:pt-44 lg:pb-24">
      {background && <Image src={background} alt="" fill priority sizes="100vw" className="object-cover" />}
      {background && <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/85 to-abyss/45" />}
      <div aria-hidden className="absolute -top-40 left-1/2 h-96 w-[46rem] -translate-x-1/2 rounded-full bg-ocean/30 blur-[110px]" />
      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-aqua">{eyebrow}</p>
        <h1 className="max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl md:leading-[1.08]">{title}</h1>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-mist">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
