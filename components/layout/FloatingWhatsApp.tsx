import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" className="fixed right-4 bottom-24 z-40 md:right-5 md:bottom-5 grid size-14 place-items-center rounded-full bg-gradient-to-br from-cyan to-aqua text-abyss shadow-lg shadow-cyan/30 transition-transform hover:scale-105">
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
