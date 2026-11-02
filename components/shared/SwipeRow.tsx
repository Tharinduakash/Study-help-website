import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// A swipeable row on phones that becomes the grid in `className` from tablet width up.
export function SwipeRow({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0", className)}>{children}</div>;
}

export const swipeItem = "w-[84%] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none";
