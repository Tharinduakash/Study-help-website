import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import { FinalCta } from "@/components/home/FinalCta";
import { SampleBadge } from "@/components/portfolio/ProjectCard";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { PageHero, Section } from "@/components/shared/Section";
import { ButtonLink } from "@/components/ui/button";
import { getProject, getProjects, getServiceCategory } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/portfolio/${project.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const area = await getServiceCategory(project.categorySlug);
  const embed = project.videoUrl ? youtubeEmbedUrl(project.videoUrl) : null;

  return (
    <>
      <PageHero eyebrow={project.category} title={project.title} lead={project.summary} image={area?.imageUrl}>
        {project.isSample && <div className="mt-5"><SampleBadge /></div>}
      </PageHero>
      <Section>
        <Link href="/portfolio" className="mb-10 inline-flex items-center gap-1 text-sm text-aqua hover:underline"><ChevronLeft className="size-4" aria-hidden />All projects</Link>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            {embed
              ? <iframe src={embed} title={project.title} loading="lazy" allowFullScreen className="aspect-video w-full rounded-2xl border border-aqua/15" />
              : (
                <div className="overflow-hidden rounded-2xl border border-aqua/15">
                  {project.coverImageUrl
                    ? <Image src={project.coverImageUrl} alt={project.title} width={960} height={600} priority sizes="(min-width: 1024px) 60vw, 100vw" className="w-full object-cover" />
                    : <ProjectCover variant={project.cover} title={project.title} />}
                </div>
              )}
            {project.videoUrl && !embed && <a href={project.videoUrl} target="_blank" rel="noreferrer" className="inline-block text-aqua hover:underline">Watch the video</a>}
            {project.gallery && project.gallery.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((image) => (
                  <li key={image.url}><Image src={image.url} alt={image.alt || project.title} width={640} height={400} loading="lazy" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" className="rounded-xl border border-aqua/15 object-cover" /></li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Overview</h2>
            <p className="mt-3 leading-relaxed text-mist">{project.description}</p>
            {project.outcomes && project.outcomes.length > 0 && (
              <>
                <h2 className="mt-8 font-display text-xl font-bold">Outcomes</h2>
                <ul className="mt-3 space-y-2">{project.outcomes.map((item) => <li key={item} className="flex gap-3 text-mist"><Check className="mt-1 size-4 shrink-0 text-aqua" aria-hidden />{item}</li>)}</ul>
              </>
            )}
            <h2 className="mt-8 font-display text-xl font-bold">Deliverables</h2>
            <ul className="mt-3 space-y-2">{project.deliverables.map((item) => <li key={item} className="flex gap-3 text-mist"><Check className="mt-1 size-4 shrink-0 text-aqua" aria-hidden />{item}</li>)}</ul>
            <h2 className="mt-8 font-display text-xl font-bold">Technologies</h2>
            <ul className="mt-3 flex flex-wrap gap-2">{project.tags.map((tag) => <li key={tag} className="rounded-full bg-white/6 px-3 py-1 text-sm text-mist">{tag}</li>)}</ul>
            <ButtonLink href={`/quote?category=${project.categorySlug}`} className="mt-8">Start a similar project</ButtonLink>
          </div>
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
