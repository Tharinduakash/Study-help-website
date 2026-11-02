import { Suspense } from "react";
import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero, Section } from "@/components/shared/Section";
import { getServiceCategories, getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Request a Quotation",
  description: "Tell us about your project and receive a customized quotation from Study Help.",
  alternates: { canonical: "/quote" },
};

export default async function QuotePage() {
  const [categories, settings] = await Promise.all([getServiceCategories(), getSiteSettings()]);
  return (
    <>
      <PageHero banner="heroQuoteImageUrl" eyebrow="Start your project" title="Tell us what you need." lead="Share your requirements and we will prepare a customized quotation." />
      <Section>
        <div className="mx-auto max-w-3xl"><Suspense><InquiryForm categories={categories} whatsappNumber={settings.whatsappNumber} /></Suspense></div>
      </Section>
    </>
  );
}
