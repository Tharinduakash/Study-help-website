import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/FinalCta";
import { Reveal } from "@/components/shared/Reveal";
import { PageHero, Section } from "@/components/shared/Section";
import { TeamCard } from "@/components/team/TeamCard";
import { getTeamMembers } from "@/lib/data";
import { showTeam } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the academic, technical and creative team behind Study Help.",
  alternates: { canonical: "/team" },
};

export default async function TeamPage() {
  if (!showTeam) notFound();
  const teamMembers = await getTeamMembers();
  return (
    <>
      <PageHero banner="heroTeamImageUrl" eyebrow="Our team" title="The people behind the work." lead="Academic, technical and creative specialists working as one team." />
      <Section>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {teamMembers.map((member, index) => <Reveal key={member.id} delay={index * 0.05} className="h-full"><TeamCard member={member} /></Reveal>)}
        </div>
      </Section>
      <FinalCta />
    </>
  );
}
