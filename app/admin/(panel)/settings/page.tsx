import type { Metadata } from "next";
import { AdminForm, ImageField, TextAreaField, TextField } from "@/components/admin/form";
import { PageHeader, Panel } from "@/components/admin/ui";
import { saveSettings } from "@/lib/admin/actions";
import { changePassword } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/session";
import { getSiteSettings } from "@/lib/data";
import { pageBanners } from "@/lib/site-config";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  return (
    <>
      <PageHeader title="Website settings" lead="Empty contact details stay hidden on the public site." />
      <div className="max-w-3xl space-y-8">
        <AdminForm action={saveSettings} submitLabel="Save settings">
          <Panel title="Contact details" className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="whatsappNumber" label="WhatsApp number" hint="Digits only, with country code, e.g. 94771234567" defaultValue={settings.whatsappNumber} />
              <TextField name="phone" label="Phone" defaultValue={settings.phone} />
              <TextField name="email" label="Email" type="email" defaultValue={settings.email} />
              <TextField name="serviceArea" label="Location or service area" defaultValue={settings.serviceArea} />
            </div>
            <TextAreaField name="socials" label="Social media links" hint="One per line, as: Facebook | https://facebook.com/studyhelp" defaultValue={settings.socials.map((link) => `${link.label} | ${link.href}`).join("\n")} rows={3} />
          </Panel>
          <Panel title="Homepage content" className="space-y-5">
            <TextField name="heroHeadline" label="Hero headline" defaultValue={settings.heroHeadline} />
            <TextAreaField name="heroText" label="Hero supporting text (optional)" hint="Leave empty to hide it." defaultValue={settings.heroText} rows={2} />
            <TextField name="ctaHeadline" label="Final call-to-action headline" defaultValue={settings.ctaHeadline} />
            <TextAreaField name="ctaText" label="Final call-to-action text" defaultValue={settings.ctaText} rows={2} />
            <ImageField name="ctaImageUrl" label="Final call-to-action background" folder="services" defaultValue={settings.ctaImageUrl} />
          </Panel>
          <Panel title="Page banners" className="space-y-5">
            {pageBanners.map(({ name, label }) => <ImageField key={name} name={name} label={`${label} banner`} folder="services" defaultValue={settings[name]} />)}
          </Panel>
          <Panel title="Company information" className="space-y-5">
            <TextAreaField name="companyIntro" label="Introduction" defaultValue={settings.companyIntro} rows={3} />
            <TextAreaField name="story" label="Our story" hint="Each line becomes a paragraph." defaultValue={settings.story} rows={5} />
            <TextAreaField name="mission" label="Mission" defaultValue={settings.mission} rows={2} />
            <TextAreaField name="vision" label="Vision" defaultValue={settings.vision} rows={2} />
            <ImageField name="aboutImageUrl" label="About section image" folder="services" defaultValue={settings.aboutImageUrl} />
          </Panel>
        </AdminForm>
        <Panel title="Change your password">
          <AdminForm action={changePassword} submitLabel="Change password" resetOnSuccess>
            <TextField name="current" label="Current password" type="password" autoComplete="current-password" />
            <TextField name="next" label="New password" hint="At least 12 characters." type="password" autoComplete="new-password" />
          </AdminForm>
        </Panel>
      </div>
    </>
  );
}
