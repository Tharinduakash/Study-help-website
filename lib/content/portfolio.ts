export const portfolioCategories = [
  "Excel Dashboards",
  "Power BI",
  "Research & Reports",
  "Case Studies",
  "PowerPoint Presentations",
  "Software Development",
  "Web Applications",
  "Academic Posters",
  "Video Editing",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];
export type CoverVariant = "dashboard" | "report" | "slides" | "code" | "poster" | "video";

export type PortfolioProject = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  categorySlug: string;
  summary: string;
  description: string;
  tags: string[];
  deliverables: string[];
  outcomes?: string[];
  cover: CoverVariant;
  coverImageUrl?: string | null;
  videoUrl?: string | null;
  gallery?: { url: string; alt: string }[];
  // True for illustrative concepts. Replace with real, permitted work before launch.
  isSample: boolean;
  featured: boolean;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "sales-performance-dashboard",
    title: "Sales Performance Dashboard",
    category: "Excel Dashboards",
    categorySlug: "data-business-intelligence",
    summary: "A one-screen Excel view of revenue, targets and product trends.",
    description: "A concept showing how raw monthly sales data can become an interactive Excel dashboard with slicers, KPI cards and automatic summaries.",
    tags: ["Excel", "Pivot Tables", "Slicers"],
    deliverables: ["Interactive workbook", "Cleaned data sheet", "Refresh instructions"],
    cover: "dashboard",
    isSample: true,
    featured: true,
  },
  {
    slug: "operations-insights-report",
    title: "Operations Insights Report",
    category: "Power BI",
    categorySlug: "data-business-intelligence",
    summary: "A connected multi-page Power BI report for operational tracking.",
    description: "A concept for a multi-page Power BI report, using a clean data model and DAX measures to compare performance across teams and time periods.",
    tags: ["Power BI", "DAX", "Data Modelling"],
    deliverables: ["Power BI report file", "Data model", "Measure notes"],
    cover: "dashboard",
    isSample: true,
    featured: true,
  },
  {
    slug: "research-report-formatting",
    title: "Research Report Formatting",
    category: "Research & Reports",
    categorySlug: "academic-research-support",
    summary: "A consistent structure, styles and contents for a long document.",
    description: "A concept showing how heading styles, numbering, captions and an automatic contents page bring a long report into a professional layout.",
    tags: ["Word", "Styles", "Referencing"],
    deliverables: ["Formatted document", "Reusable styles"],
    cover: "report",
    isSample: true,
    featured: false,
  },
  {
    slug: "case-study-structure-guide",
    title: "Case Study Structure Guide",
    category: "Case Studies",
    categorySlug: "academic-research-support",
    summary: "A reusable framework for organising a business case study.",
    description: "A concept for a guidance document that explains how to approach a case, organise evidence and present recommendations clearly.",
    tags: ["Guidance", "Frameworks", "Structure"],
    deliverables: ["Structure template", "Guidance notes"],
    cover: "report",
    isSample: true,
    featured: false,
  },
  {
    slug: "research-defence-deck",
    title: "Research Defence Deck",
    category: "PowerPoint Presentations",
    categorySlug: "presentation-graphic-design",
    summary: "A clean slide system built for presenting research findings.",
    description: "A concept for a presentation template with consistent layouts for methodology, charts and findings, designed to be readable from the back of a room.",
    tags: ["PowerPoint", "Slide Design", "Data Visuals"],
    deliverables: ["Editable deck", "PDF export"],
    cover: "slides",
    isSample: true,
    featured: true,
  },
  {
    slug: "booking-management-system",
    title: "Booking Management System",
    category: "Software Development",
    categorySlug: "it-software-development",
    summary: "A database-backed system for managing appointments and records.",
    description: "A concept for a booking system with a structured database, role-based access and day-to-day reporting for staff.",
    tags: ["TypeScript", "PostgreSQL", "Authentication"],
    deliverables: ["Source code", "Database schema", "Setup guide"],
    cover: "code",
    isSample: true,
    featured: false,
  },
  {
    slug: "small-business-web-app",
    title: "Small Business Web App",
    category: "Web Applications",
    categorySlug: "it-software-development",
    summary: "A responsive site with a content dashboard for the owner.",
    description: "A concept for a mobile-friendly business website with an admin area, so the owner can update services and manage customer inquiries without touching code.",
    tags: ["Next.js", "Tailwind CSS", "Admin Dashboard"],
    deliverables: ["Deployed website", "Admin dashboard", "Source code"],
    cover: "code",
    isSample: true,
    featured: true,
  },
  {
    slug: "conference-research-poster",
    title: "Conference Research Poster",
    category: "Academic Posters",
    categorySlug: "presentation-graphic-design",
    summary: "A print-ready poster with a clear reading order.",
    description: "A concept showing how a research summary can be arranged into a scannable poster with a strong hierarchy and clear charts.",
    tags: ["Poster Design", "Layout", "Print"],
    deliverables: ["Print-ready PDF", "Editable source file"],
    cover: "poster",
    isSample: true,
    featured: false,
  },
  {
    slug: "brand-promo-edit",
    title: "Brand Promo Edit",
    category: "Video Editing",
    categorySlug: "video-creative-studio",
    summary: "A short promotional edit with versions for each platform.",
    description: "A concept for a short brand video with paced cuts, colour treatment, captions and alternate sizes for social platforms.",
    tags: ["Video Editing", "Colour", "Captions"],
    deliverables: ["Master video", "Vertical and square cuts"],
    cover: "video",
    isSample: true,
    featured: true,
  },
];
