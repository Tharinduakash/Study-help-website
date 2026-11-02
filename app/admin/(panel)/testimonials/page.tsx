import type { Metadata } from "next";
import Link from "next/link";
import { ActionButton } from "@/components/admin/form";
import { Badge, EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import { setTestimonialStatus } from "@/lib/admin/actions";
import { listTestimonials } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsAdminPage() {
  const reviews = await listTestimonials();
  return (
    <>
      <PageHeader title="Testimonials" lead="Customers can submit reviews at /review. Only approved reviews appear publicly." action={{ href: "/admin/testimonials/new", label: "New review" }} />
      <Panel>
        {reviews.length === 0 ? <EmptyState>No reviews yet. Only add genuine, approved feedback.</EmptyState> : (
          <ul className="divide-y divide-aqua/10">
            {reviews.map((review) => (
              <li key={review.id} className="py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link href={`/admin/testimonials/${review.id}`} className="font-medium hover:underline">{review.name} · {review.service} · {review.rating}/5</Link>
                  <Badge>{review.status}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-mist">{review.quote}</p>
                <div className="mt-3 flex gap-5">
                  {review.status !== "approved" && <ActionButton action={setTestimonialStatus} fields={{ id: review.id, status: "approved" }} label="Approve" />}
                  {review.status !== "rejected" && <ActionButton action={setTestimonialStatus} fields={{ id: review.id, status: "rejected" }} label="Reject" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
