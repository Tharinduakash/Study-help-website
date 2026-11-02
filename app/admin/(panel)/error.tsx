"use client";

import { buttonVariants } from "@/components/ui/button";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">Something went wrong.</h1>
      <p className="mt-2 text-mist">Your last change may not have been saved.</p>
      <button type="button" onClick={reset} className={buttonVariants({ className: "mt-6" })}>Try again</button>
    </div>
  );
}
