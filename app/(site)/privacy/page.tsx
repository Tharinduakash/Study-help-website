import type { Metadata } from "next";
import { PageHero, Section } from "@/components/shared/Section";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero banner="heroLegalImageUrl" eyebrow="Legal" title="Privacy Policy" />
      <Section tone="light">
        <div className="max-w-3xl space-y-5 leading-relaxed text-deep/80">
          <p>We use the details and files you send us only to respond to your request and deliver your project.</p>
          <p>Files you upload are kept private and are never displayed publicly. We do not publish your work in our portfolio without your permission.</p>
          <p>To ask about, correct or remove your information, please contact us through the contact page.</p>
        </div>
      </Section>
    </>
  );
}
