import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { PortfolioBrowser } from "@/components/portfolio/PortfolioBrowser";
import { PageHero, Section } from "@/components/shared/Section";
import { getProjects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore dashboards, reports, software, presentations, posters and video projects from Study Help.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero eyebrow="Our work" title="Discover our work." lead="Browse by category or search for a specific tool or technology." />
      <Section><PortfolioBrowser projects={projects} /></Section>
      <FinalCta />
    </>
  );
}
