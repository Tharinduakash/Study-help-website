import type { Metadata } from "next";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { PageHero, Section } from "@/components/shared/Section";
import { getServiceCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Leave a Review",
  description: "Share your experience of working with Study Help.",
  alternates: { canonical: "/review" },
};

export default async function ReviewPage() {
  const categories = await getServiceCategories();
  return (
    <>
      <PageHero banner="heroReviewImageUrl" eyebrow="Your feedback" title="Tell us how it went." lead="Reviews are checked by our team before they are published." />
      <Section>
        <div className="mx-auto max-w-3xl"><ReviewForm services={categories.map((category) => category.title)} /></div>
      </Section>
    </>
  );
}
