import type { Metadata } from "next";
import { PageHero, Section } from "@/components/shared/Section";

export const metadata: Metadata = { title: "Terms and Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <>
      <PageHero banner="heroLegalImageUrl" eyebrow="Legal" title="Terms and Conditions" />
      <Section tone="light">
        <div className="max-w-3xl space-y-5 leading-relaxed text-deep/80">
          <p>Scope, price, deadline and revision terms for each project are set out in your quotation and apply once you accept it.</p>
          <p>Our academic services provide guidance, editing, formatting and learning support. You remain responsible for your own work and for following your institution&apos;s rules.</p>
          <p>Please only send us files and information you have the right to share.</p>
        </div>
      </Section>
    </>
  );
}
