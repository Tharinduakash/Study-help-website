import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { getSiteSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site-config";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <MotionProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-abyss">Skip to content</a>
      <Navbar />
      {/* Clipped here, not just on the page body: mobile browsers widen the whole page to fit anything waiting off-screen to slide in. */}
      <main id="main" className="flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <BottomNav />
      <FloatingWhatsApp href={whatsappLink(settings.whatsappNumber, "Hi Study Help, I would like to discuss a project.")} />
    </MotionProvider>
  );
}
