import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { ServiceExplorer } from "@/components/services/ServiceExplorer";
import { PageHero, Section } from "@/components/shared/Section";
import { getServiceCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description: "Data and business intelligence, academic support, software development, presentation design and video production.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const categories = await getServiceCategories();
  return (
    <>
      <PageHero banner="heroServicesImageUrl" eyebrow="Our services" title="Explore what we can do for you." lead="Search for what you need, or dive into our five areas of expertise." />
      <Section><ServiceExplorer categories={categories} /></Section>
      <FinalCta />
    </>
  );
}
