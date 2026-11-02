import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { MissionVision } from "@/components/about/MissionVision";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/shared/Reveal";
import { PageHero, Section } from "@/components/shared/Section";
import { coreValues, differentiators } from "@/lib/content/general";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Study Help is a team bringing academic support, technical knowledge and creativity together.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero banner="heroAboutImageUrl" eyebrow="About us" title="Bringing academic support, technology and creativity together." lead="We help students, professionals and businesses turn their requirements into meaningful results." />

      <Section tone="light" eyebrow="Our story" title="One team for connected work.">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal className="space-y-5 text-lg leading-relaxed text-deep/80">
            {settings.story.split("\n").filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Reveal>
          {settings.aboutImageUrl && <Reveal delay={0.1}><Image src={settings.aboutImageUrl} alt="" width={960} height={600} sizes="(min-width: 768px) 50vw, 100vw" className="rounded-2xl object-cover shadow-lg" /></Reveal>}
        </div>
      </Section>

      <Section>
        <MissionVision mission={settings.mission} vision={settings.vision} />
      </Section>

      <Section tone="deep" eyebrow="Core values" title="What guides our work.">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, index) => (
            <Reveal key={value.title} delay={index * 0.06}>
              <h3 className="font-display text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 leading-relaxed text-mist">{value.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" eyebrow="What makes us different" title="More than a single service.">
        <ul className="max-w-2xl space-y-4">
          {differentiators.map((item) => (
            <li key={item} className="flex gap-3 text-lg font-medium"><BadgeCheck className="mt-1 size-5 shrink-0 text-ocean" aria-hidden />{item}</li>
          ))}
        </ul>
      </Section>

      <FinalCta />
    </>
  );
}
