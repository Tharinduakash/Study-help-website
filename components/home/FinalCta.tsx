import Image from "next/image";
import { Reveal, RevealHeading } from "@/components/shared/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/data";

export async function FinalCta() {
  const settings = await getSiteSettings();
  return (
    <section className="relative overflow-hidden bg-abyss px-4 py-24 text-center sm:px-6 md:py-32">
      {settings.ctaImageUrl && <Image src={settings.ctaImageUrl} alt="" fill sizes="100vw" className="object-cover" />}
      {settings.ctaImageUrl && <div aria-hidden className="absolute inset-0 bg-abyss/80" />}
      <div aria-hidden className="absolute bottom-[-14rem] left-1/2 h-[28rem] w-[50rem] max-w-full -translate-x-1/2 rounded-full bg-ocean/40 blur-[110px]" />
      <div className="relative mx-auto max-w-2xl">
        <RevealHeading text={settings.ctaHeadline} className="font-display text-4xl font-bold tracking-tight md:text-5xl" />
      </div>
      <Reveal effect="scale" delay={0.3} className="relative mx-auto max-w-2xl">
        <p className="mt-4 text-lg text-mist">{settings.ctaText}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/quote" size="lg">Start Your Project</ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="outline">Contact Us</ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
