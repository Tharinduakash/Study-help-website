import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { Accordion } from "@/components/shared/Accordion";
import { PageHero, Section } from "@/components/shared/Section";
import { getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Study Help services, pricing, deadlines, payments, revisions, file submissions and support.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      <PageHero banner="heroFaqImageUrl" eyebrow="FAQ" title="Frequently asked questions." />
      <Section tone="light"><div className="mx-auto max-w-3xl"><Accordion items={faqs} light /></div></Section>
      <FinalCta />
    </>
  );
}
