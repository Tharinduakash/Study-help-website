import type { Metadata, Viewport } from "next";
import { Manrope, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700"] });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const viewport: Viewport = { themeColor: "#061426", viewportFit: "cover" };

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}<Analytics /></body>
    </html>
  );
}
