import type { Faq } from "./services";

export type TeamMember = {
  name: string;
  designation: string;
  bio: string;
  skills: string[];
  image?: string | null;
  links: { label: string; href: string }[];
};

// Starter rows for db/seed.ts. Suggested roles only: replace them with real people in the dashboard.
export const teamMembers: TeamMember[] = [
  { name: "", designation: "IT & Development Lead", bio: "Leads software, data and technical projects.", skills: ["Software", "Databases", "Data Science"], links: [] },
  { name: "", designation: "Academic Support Lead", bio: "Guides reports, research and documentation.", skills: ["Research", "Editing", "Formatting"], links: [] },
  { name: "", designation: "Data & Dashboard Specialist", bio: "Builds Excel, Power BI and analytics solutions.", skills: ["Excel", "Power BI", "Analytics"], links: [] },
  { name: "", designation: "Creative Design Specialist", bio: "Designs presentations, posters and graphics.", skills: ["PowerPoint", "Posters", "Graphics"], links: [] },
  { name: "", designation: "Video & Media Specialist", bio: "Shapes video editing and creative production.", skills: ["Editing", "Videography", "Content"], links: [] },
];

export type Testimonial = { quote: string; name: string; service: string; rating: number };

// Only approved, genuine reviews belong here. The section stays hidden while empty.
export const testimonials: Testimonial[] = [];

export const coreValues = [
  { title: "Integrity", text: "Honest advice, clear scope and work that respects academic rules." },
  { title: "Craft", text: "Careful, considered work, however small the project." },
  { title: "Clarity", text: "Plain communication from the first message to final delivery." },
  { title: "Curiosity", text: "New tools and better ways of solving each problem." },
];

export const differentiators = [
  "Academic, technical and creative skills under one team",
  "A customized quotation before any work begins",
  "One point of contact throughout your project",
];

export const whyChooseUs = [
  { title: "Multiple service categories", text: "Reports, dashboards, software, design and video in one place.", icon: "layers" },
  { title: "Technology-driven solutions", text: "Modern tools chosen for the job, never for show.", icon: "cpu" },
  { title: "Experienced team members", text: "Each project goes to the person best suited to it.", icon: "users" },
  { title: "Customer-focused communication", text: "You know where your project stands at each stage.", icon: "message" },
  { title: "Professional project handling", text: "Your files and requirements are treated with care.", icon: "shield" },
  { title: "Transparent quotations", text: "Scope and price are agreed before work begins.", icon: "receipt" },
  { title: "Reliable delivery processes", text: "A clear process from request to final deliverables.", icon: "check" },
] as const;

export const processSteps = [
  { title: "Explore our services", text: "Find the service that matches what you need." },
  { title: "Submit your project requirements", text: "Share your brief, deadline and reference files." },
  { title: "Receive a customized quotation", text: "We review the scope and send you a clear price." },
  { title: "Complete the project and receive the deliverables", text: "We complete the agreed work and hand everything over." },
];

export const faqs: Faq[] = [
  { question: "What services do you offer?", answer: "We work across five areas: data and business intelligence, academic and research support, IT and software development, presentation and graphic design, and video and creative production." },
  { question: "How much does a project cost?", answer: "Most projects are quoted individually because scope varies. Send your requirements and we will prepare a customized quotation before any work begins." },
  { question: "How do project deadlines work?", answer: "Tell us your preferred deadline when you submit your request. We will confirm whether it is achievable as part of your quotation." },
  { question: "What payment methods do you accept?", answer: "Accepted payment methods and the payment schedule are confirmed with your quotation." },
  { question: "Are revisions included?", answer: "Your quotation states what is included, so you know the revision terms before the project begins." },
  { question: "How do I submit my files?", answer: "Attach reference files to your project request. They stay private and are never displayed publicly." },
  { question: "How do I get support during a project?", answer: "You can reach the team through the contact options on this site. We will keep you updated as your project moves forward." },
];
