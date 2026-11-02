import { Suspense } from "react";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero, Section } from "@/components/shared/Section";
import { getServiceCategories, getSiteSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Study Help about your academic, technology or creative project.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [categories, settings] = await Promise.all([getServiceCategories(), getSiteSettings()]);
  const whatsapp = whatsappLink(settings.whatsappNumber, "Hi Study Help, I would like to get in touch.");
  const methods = [
    whatsapp && { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: whatsapp },
    settings.email && { icon: Mail, label: "Email", value: settings.email, href: `mailto:${settings.email}` },
    settings.phone && { icon: Phone, label: "Phone", value: settings.phone, href: `tel:${settings.phone}` },
    settings.serviceArea && { icon: MapPin, label: "Service area", value: settings.serviceArea },
  ].filter((method) => !!method);

  return (
    <>
      <PageHero banner="heroContactImageUrl" eyebrow="Contact" title="Let's talk about your project." lead="Send us a message and we will help you find the right next step." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-4">
            {methods.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <Icon className="size-5 text-aqua" aria-hidden />
                  <span><span className="block text-xs text-mist">{label}</span><span className="block font-medium">{value}</span></span>
                </>
              );
              return href ? <a key={label} href={href} className="glass glow-hover flex items-center gap-4 rounded-2xl p-5">{body}</a> : <div key={label} className="glass flex items-center gap-4 rounded-2xl p-5">{body}</div>;
            })}
            {settings.socials.map((social) => <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className="mr-4 text-aqua hover:underline">{social.label}</a>)}
          </div>
          <Suspense><InquiryForm categories={categories} whatsappNumber={settings.whatsappNumber} compact /></Suspense>
        </div>
      </Section>
    </>
  );
}
