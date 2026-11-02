import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft, Info } from "lucide-react";
import { FinalCta } from "@/components/home/FinalCta";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Accordion } from "@/components/shared/Accordion";
import { PageHero, Section } from "@/components/shared/Section";
import { ButtonLink } from "@/components/ui/button";
import { getProjectsForCategory, getService, getServiceCategories, getSiteSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site-config";

type Props = { params: Promise<{ category: string; service: string }> };

export async function generateStaticParams() {
  const categories = await getServiceCategories();
  return categories.flatMap((category) => category.services.map((service) => ({ category: category.slug, service: service.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, service } = await params;
  const result = await getService(category, service);
  if (!result) return {};
  return { title: result.service.title, description: result.service.summary, alternates: { canonical: `/services/${category}/${service}` } };
}

export default async function ServicePage({ params }: Props) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const result = await getService(categorySlug, serviceSlug);
  if (!result) notFound();
  const { category, service } = result;
  const image = service.imageUrl ?? category.imageUrl;
  const description = service.description ?? category.description;
  const [projects, settings] = await Promise.all([getProjectsForCategory(categorySlug), getSiteSettings()]);
  const whatsapp = whatsappLink(settings.whatsappNumber, `Hi Study Help, I am interested in ${service.title}.`);

  return (
    <>
      <PageHero eyebrow={category.title} title={service.title} lead={service.summary} image={image}>
        <p className="mt-5 font-display text-aqua">{service.pricing.type === "fixed" ? service.pricing.label : "Priced by customized quotation"}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/quote?service=${service.slug}`} size="lg">Request a Quotation</ButtonLink>
          {whatsapp && <a href={whatsapp} className="inline-flex h-13 items-center justify-center rounded-full border border-aqua/40 px-8 font-semibold hover:bg-aqua/10">Ask on WhatsApp</a>}
        </div>
      </PageHero>

      <Section>
        <Link href={`/services/${category.slug}`} className="mb-10 inline-flex items-center gap-1 text-sm text-aqua hover:underline"><ChevronLeft className="size-4" aria-hidden />All {category.title} services</Link>
        <p className="mb-12 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-mist">{description}</p>
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold">Service options</h2>
            <ul className="mt-5 space-y-3">{service.options.map((option) => <li key={option} className="flex gap-3 text-mist"><Check className="mt-1 size-4 shrink-0 text-aqua" aria-hidden />{option}</li>)}</ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">What you receive</h2>
            <ul className="mt-5 space-y-3">{category.deliverables.map((item) => <li key={item} className="flex gap-3 text-mist"><Check className="mt-1 size-4 shrink-0 text-aqua" aria-hidden />{item}</li>)}</ul>
          </div>
        </div>
        {category.note && <p className="mt-10 flex gap-3 rounded-xl border border-aqua/20 bg-cyan/8 p-4 text-sm leading-relaxed text-mist"><Info className="mt-0.5 size-4 shrink-0 text-aqua" aria-hidden />{category.note}</p>}
      </Section>

      {projects.length > 0 && (
        <Section tone="deep" eyebrow="Related work" title="Relevant portfolio projects.">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </Section>
      )}

      <Section eyebrow="FAQ" title="Common questions."><Accordion items={category.faqs} /></Section>
      <FinalCta />
    </>
  );
}
