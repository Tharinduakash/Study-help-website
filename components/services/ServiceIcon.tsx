import { BarChart3, BookOpenText, Clapperboard, CodeXml, Presentation } from "lucide-react";
import type { ServiceCategory } from "@/lib/content/services";

const icons = {
  chart: BarChart3,
  book: BookOpenText,
  code: CodeXml,
  presentation: Presentation,
  video: Clapperboard,
};

export function ServiceIcon({ name, className }: { name: ServiceCategory["icon"]; className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} aria-hidden />;
}
