import { ArrowRight, BadgeCheck, Cpu, Layers, MessagesSquare, ReceiptText, ShieldCheck, Users } from "lucide-react";
import { DepthGauge } from "@/components/home/DepthGauge";
import { FinalCta } from "@/components/home/FinalCta";
import { Hero } from "@/components/home/Hero";
import { ParallaxImage } from "@/components/home/ParallaxImage";
import { ProcessJourney } from "@/components/home/ProcessJourney";
import { ServiceAccordion } from "@/components/home/ServiceAccordion";
import { TestimonialCarousel } from "@/components/home/TestimonialCarousel";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { Accordion } from "@/components/shared/Accordion";
import { Reveal, RevealHeading } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SwipeRow, swipeItem } from "@/components/shared/SwipeRow";
import { TeamCard } from "@/components/team/TeamCard";
import { ButtonLink } from "@/components/ui/button";
import { showTeam } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { differentiators, processSteps, whyChooseUs } from "@/lib/content/general";
import { getFaqs, getFeaturedProjects, getServiceCategories, getSiteSettings, getTeamMembers, getTestimonials } from "@/lib/data";

const featureIcons = { layers: Layers, cpu: Cpu, users: Users, message: MessagesSquare, shield: ShieldCheck, receipt: ReceiptText, check: BadgeCheck };
const sideHeading = "font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.75rem] md:leading-[1.12]";
const eyebrow = "mb-3 text-xs font-bold tracking-[0.22em] uppercase";

export default async function HomePage() {
  const [categories, projects, settings, teamMembers, testimonials, faqs] = await Promise.all([
    getServiceCategories(),
    getFeaturedProjects(),
    getSiteSettings(),
    getTeamMembers(),
    getTestimonials(),
    getFaqs(),
  ]);

  const serviceCount = categories.reduce((total, category) => total + category.services.length, 0);
  const [leadProject, ...sideProjects] = projects;

  return (
    <>
      <DepthGauge />
      <Hero headline={settings.heroHeadline} text={settings.heroText} />

      <Section id="services" eyebrow="What we do" title="Five areas of expertise, one dependable team." lead="Whatever you are working on, start with the area closest to your goal.">
        <ServiceAccordion categories={categories} />
      </Section>

      <Section tone="deep" eyebrow="Our work" title="See the kind of work we create." lead="A closer look at how we approach projects in each area.">
        {leadProject && (
          <div className="grid gap-5 lg:grid-cols-3 lg:grid-rows-2">
            <Reveal effect="scale" className="lg:col-span-2 lg:row-span-2 lg:min-h-[38rem]"><ProjectCard project={leadProject} /></Reveal>
            {sideProjects.slice(0, 2).map((project, index) => <Reveal key={project.slug} effect="right" delay={0.12 * (index + 1)} className="h-full"><ProjectCard project={project} /></Reveal>)}
          </div>
        )}
        <Reveal delay={0.2} className="mt-8"><ButtonLink href="/portfolio" variant="outline">View full portfolio<ArrowRight className="size-4" aria-hidden /></ButtonLink></Reveal>
      </Section>

      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <Reveal effect="left" className="relative pb-10 lg:pb-0">
            {settings.aboutImageUrl && <ParallaxImage src={settings.aboutImageUrl} className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-xl" />}
            <Reveal effect="scale" delay={0.35}>
            <dl className="absolute right-4 bottom-0 left-4 grid grid-cols-3 divide-x divide-white/15 rounded-2xl bg-abyss p-4 text-white shadow-xl lg:-right-6 lg:-bottom-6 lg:left-auto lg:w-96">
              {[[categories.length, "Service areas"], [serviceCount, "Services"], [1, "Point of contact"]].map(([value, label]) => (
                <div key={label} className="px-3 text-center">
                  <dd className="font-display text-2xl font-bold text-aqua">{value}</dd>
                  <dt className="mt-0.5 text-xs text-mist">{label}</dt>
                </div>
              ))}
            </dl>
            </Reveal>
          </Reveal>
          <Reveal effect="right" delay={0.1}>
            <p className={cn(eyebrow, "text-ocean")}>About us</p>
            <RevealHeading text="Academic knowledge, technical skill and creativity, together." className={sideHeading} delay={0.15} />
            <p className="mt-5 text-lg leading-relaxed text-deep/80">{settings.companyIntro}</p>
            <ul className="mt-6 space-y-3">
              {differentiators.map((item) => <li key={item} className="flex gap-3 font-medium"><BadgeCheck className="mt-0.5 size-5 shrink-0 text-ocean" aria-hidden />{item}</li>)}
            </ul>
            <ButtonLink href="/about" variant="dark" className="mt-7">More about us</ButtonLink>
          </Reveal>
        </div>
      </Section>

      {showTeam && (
        <Section eyebrow="Meet our team" title="The people behind the work.">
          <SwipeRow className="md:grid-cols-3">
            {teamMembers.slice(0, 3).map((member) => <div key={member.id} className={swipeItem}><TeamCard member={member} /></div>)}
          </SwipeRow>
          <div className="mt-10"><ButtonLink href="/team" variant="outline">Meet the full team</ButtonLink></div>
        </Section>
      )}

      <Section tone="deep">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-16">
          <Reveal effect="left" className="lg:sticky lg:top-28 lg:self-start">
            <p className={cn(eyebrow, "text-aqua")}>Why choose us</p>
            <RevealHeading text="Built around how you like to work." className={sideHeading} delay={0.1} />
            <p className="mt-4 text-lg leading-relaxed text-mist">Clear communication and careful work, from your first message to final delivery.</p>
            <ButtonLink href="/quote" className="mt-7">Start Your Project</ButtonLink>
          </Reveal>
          <ul className="divide-y divide-aqua/12 border-y border-aqua/12">
            {whyChooseUs.map((item, index) => {
              const Icon = featureIcons[item.icon];
              return (
                <li key={item.title}>
                  <Reveal effect="right" delay={index * 0.06} className="group flex items-start gap-5 py-6 transition-transform duration-300 hover:translate-x-2 motion-reduce:transform-none">
                    <span className="font-display text-sm text-aqua/60">0{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-semibold sm:text-xl">{item.title}</h3>
                      <p className="mt-1 leading-relaxed text-mist">{item.text}</p>
                    </div>
                    <Icon className="mt-1 size-6 shrink-0 text-aqua/70 transition duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:text-cyan motion-reduce:transform-none" aria-hidden />
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </Section>

      <Section tone="light" eyebrow="How it works" title="Four simple steps from idea to delivery.">
        <ProcessJourney steps={processSteps} />
      </Section>

      {testimonials.length > 0 && (
        <Section eyebrow="Customer stories" title="What our customers say.">
          <TestimonialCarousel items={testimonials} />
        </Section>
      )}

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <Reveal effect="left" className="lg:sticky lg:top-28 lg:self-start">
            <p className={cn(eyebrow, "text-aqua")}>FAQ</p>
            <RevealHeading text="Questions, answered." className={sideHeading} delay={0.1} />
            <p className="mt-4 text-lg leading-relaxed text-mist">The answers people ask for most often.</p>
            <ButtonLink href="/faq" variant="outline" className="mt-7">See all questions</ButtonLink>
          </Reveal>
          <Reveal effect="blur" delay={0.15}><Accordion items={faqs.slice(0, 5)} /></Reveal>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
