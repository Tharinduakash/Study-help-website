// Fixed brand details. Everything an admin can change lives in website_settings,
// and these defaults fill any setting that has not been saved yet.
export const siteConfig = {
  name: "Study Help",
  tagline: "Academic & Digital Solutions",
  description:
    "Study Help brings academic support, data, software and creative production together, helping you transform ideas into meaningful results.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const defaultSettings = {
  // International format, digits only, e.g. 94771234567. Empty values hide their UI.
  whatsappNumber: "",
  email: "",
  phone: "",
  serviceArea: "",
  socials: [] as { label: string; href: string }[],
  heroHeadline: "Dive Into a World of Possibilities.",
  heroText: "",
  ctaHeadline: "Your Next Big Idea Starts Here.",
  ctaText: "Let's turn your requirements into meaningful results.",
  companyIntro: "Study Help is a team that brings academic support, technology and creative production under one roof, so you do not need a different provider for each part of your project.",
  story: "Projects rarely stay in one lane. A report needs a dashboard, research needs a presentation, and a new business needs a website and a video.\nStudy Help brings those skills together, so one team can understand the whole project and carry it from first idea to final delivery.",
  mission: "To make expert academic, technical and creative support clear, accessible and dependable.",
  vision: "To be the trusted partner people turn to when they want an idea done properly.",
  aboutImageUrl: "/images/stock/about.jpg" as string | null,
  pageHeroImageUrl: "/images/stock/banner.jpg" as string | null,
  heroAboutImageUrl: "/images/stock/banners/about-team.jpg" as string | null,
  heroServicesImageUrl: "/images/stock/banners/services-workspace.jpg" as string | null,
  heroTeamImageUrl: "/images/stock/banners/team.jpg" as string | null,
  heroContactImageUrl: "/images/stock/banners/contact.jpg" as string | null,
  heroFaqImageUrl: "/images/stock/banners/faq.jpg" as string | null,
  heroQuoteImageUrl: "/images/stock/banners/quote.jpg" as string | null,
  heroReviewImageUrl: "/images/stock/banners/review.jpg" as string | null,
  heroLegalImageUrl: "/images/stock/banners/legal.jpg" as string | null,
  ctaImageUrl: "/images/stock/cta.jpg" as string | null,
};

export type SiteSettings = typeof defaultSettings;

export const pageBanners = [
  { name: "pageHeroImageUrl", label: "Portfolio" },
  { name: "heroAboutImageUrl", label: "About" },
  { name: "heroServicesImageUrl", label: "Services" },
  { name: "heroTeamImageUrl", label: "Team" },
  { name: "heroContactImageUrl", label: "Contact" },
  { name: "heroFaqImageUrl", label: "FAQ" },
  { name: "heroQuoteImageUrl", label: "Quote" },
  { name: "heroReviewImageUrl", label: "Review" },
  { name: "heroLegalImageUrl", label: "Privacy and Terms" },
] as const;

export type PageBanner = (typeof pageBanners)[number]["name"];

// Set to true to bring back the team page, its menu link and the homepage section.
export const showTeam = false;

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  ...(showTeam ? [{ label: "Our Team", href: "/team" }] : []),
  { label: "Contact", href: "/contact" },
];

export function whatsappLink(number: string, message: string): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
