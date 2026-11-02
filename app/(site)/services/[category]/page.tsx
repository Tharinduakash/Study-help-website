import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Info } from "lucide-react";
import { FinalCta } from "@/components/home/FinalCta";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ServiceIcon } from "@/components/services/ServiceIcon";
import { Accordion } from "@/components/shared/Accordion";
import { Reveal } from "@/components/shared/Reveal";
import { PageHero, Section } from "@/components/shared/Section";
import { ButtonLink } from "@/components/ui/button";
import { getProjectsForCategory, getServiceCategories, getServiceCategory } from "@/lib/data";

type Props = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  const categories = await getServiceCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getServiceCategory((await params).category);
  if (!category) return {};
  return { title: category.title, description: category.short, alternates: { canonical: `/services/${category.slug}` } };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = await getServiceCategory(slug);
  if (!category) notFound();
  const projects = await getProjectsForCategory(slug);

  return (
    <>
      <PageHero eyebrow={`Service ${category.number}`} title={category.title} lead={category.description} image={category.imageUrl}>
        <ServiceIcon name={category.icon} className="absolute top-0 right-0 hidden size-40 text-aqua/15 lg:block" />
        <ButtonLink href={`/quote?category=${category.slug}`} size="lg" className="mt-8">Request a Quotation</ButtonLink>
      </PageHero>

      {category.note && (
        <div className="bg-abyss px-4 sm:px-6">
          <p className="mx-auto flex max-w-6xl gap-3 rounded-xl border border-aqua/20 bg-cyan/8 p-4 text-sm leading-relaxed text-mist"><Info className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden />{category.note}</p>
        </div>
      )}

      <Section eyebrow="Available services" title="Choose what fits your project.">
        <div className="grid gap-4 md:grid-cols-2">
          {category.services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.03} className="h-full">
              <Link href={`/services/${category.slug}/${service.slug}`} className="glass glow-hover group flex h-full items-start justify-between gap-4 rounded-2xl p-6">
                <span>
                  <span className="block font-display text-lg font-semibold">{service.title}</span>
                  <span className="mt-1.5 block leading-relaxed text-mist">{service.summary}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-aqua" aria-hidden />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" eyebrow="What you receive" title="Clear deliverables.">
        <ul className="grid gap-4 md:grid-cols-3">
          {category.deliverables.map((item) => <li key={item} className="rounded-2xl bg-white p-6 font-medium shadow-sm">{item}</li>)}
        </ul>
      </Section>

      {projects.length > 0 && (
        <Section tone="deep" eyebrow="Related work" title="Relevant portfolio projects.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </Section>
      )}

      <Section eyebrow="FAQ" title="Common questions."><Accordion items={category.faqs} /></Section>
      <FinalCta />
    </>
  );
}
