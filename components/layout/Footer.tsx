import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { getServiceCategories, getSiteSettings } from "@/lib/data";
import { navLinks, siteConfig, whatsappLink } from "@/lib/site-config";

export async function Footer() {
  const [categories, settings] = await Promise.all([getServiceCategories(), getSiteSettings()]);
  const whatsapp = whatsappLink(settings.whatsappNumber, "Hi Study Help, I would like to know more about your services.");
  const hasContact = Boolean(whatsapp || settings.email || settings.phone);

  return (
    <footer className="border-t border-aqua/10 bg-abyss px-4 pt-12 pb-24 text-sm sm:px-6 md:pt-16 md:pb-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.5fr_1fr_1.3fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs leading-relaxed text-mist">{siteConfig.description}</p>
        </div>
        <FooterColumn title="Explore">
          {[...navLinks.slice(1), { label: "FAQ", href: "/faq" }].map((link) => <li key={link.href}><Link href={link.href} className="text-mist hover:text-white">{link.label}</Link></li>)}
        </FooterColumn>
        <FooterColumn title="Services">
          {categories.map((category) => <li key={category.slug}><Link href={`/services/${category.slug}`} className="text-mist hover:text-white">{category.title}</Link></li>)}
        </FooterColumn>
        <FooterColumn title="Contact">
          {whatsapp && <li><a href={whatsapp} className="text-mist hover:text-white">WhatsApp</a></li>}
          {settings.email && <li><a href={`mailto:${settings.email}`} className="text-mist hover:text-white">{settings.email}</a></li>}
          {settings.phone && <li><a href={`tel:${settings.phone}`} className="text-mist hover:text-white">{settings.phone}</a></li>}
          {settings.socials.map((social) => <li key={social.href}><a href={social.href} target="_blank" rel="noreferrer" className="text-mist hover:text-white">{social.label}</a></li>)}
          {!hasContact && <li><Link href="/contact" className="text-mist hover:text-white">Contact page</Link></li>}
        </FooterColumn>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col justify-between gap-3 border-t border-aqua/10 pt-6 text-xs text-mist sm:flex-row">
        <p>© {siteConfig.name}. All rights reserved.</p>
        <p className="flex flex-wrap gap-5">
          <Link href="/#reviews" className="hover:text-white">Leave a Review</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms and Conditions</Link>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-display font-semibold">{title}</h2>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}
