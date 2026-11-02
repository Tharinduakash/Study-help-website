export type Pricing = { type: "quote" } | { type: "fixed"; label: string };

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description?: string | null;
  imageUrl?: string | null;
  options: string[];
  pricing: Pricing;
};

export type Faq = { question: string; answer: string };

export type ServiceCategory = {
  slug: string;
  number: string;
  title: string;
  short: string;
  description: string;
  imageUrl?: string | null;
  icon: "chart" | "book" | "code" | "presentation" | "video";
  deliverables: string[];
  faqs: Faq[];
  note?: string | null;
  services: Service[];
};

const quote: Pricing = { type: "quote" };

function service(slug: string, title: string, summary: string, options: string[]): Service {
  return { slug, title, summary, options, pricing: quote };
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "data-business-intelligence",
    number: "01",
    title: "Data & Business Intelligence",
    short: "Turn scattered spreadsheets into dashboards and reports people actually use.",
    description:
      "We clean, model and visualise your data so decisions come from evidence. From a single advanced workbook to a full Power BI report, each build is shaped around the questions you need answered.",
    icon: "chart",
    deliverables: [
      "The finished workbook, dashboard or report file",
      "Cleaned and structured source data",
      "A short walkthrough of how to use and refresh it",
    ],
    faqs: [
      {
        question: "What do you need from me to start?",
        answer:
          "A sample of your data and the questions you want it to answer. Remove anything confidential that the work does not need.",
      },
      {
        question: "Can you improve a dashboard I already have?",
        answer: "Yes. We can rebuild, extend or tidy an existing Excel or Power BI file.",
      },
    ],
    services: [
      service("advanced-excel-solutions", "Advanced Excel Solutions", "Formulas, automation and structured workbooks that replace repetitive manual work.", ["Complex formulas", "Pivot tables and models", "Workbook clean-up"]),
      service("excel-dashboard-development", "Excel Dashboard Development", "Interactive Excel dashboards that summarise your numbers on a single screen.", ["KPI dashboards", "Slicers and interactive filters", "Automated summaries"]),
      service("power-bi-dashboards", "Power BI Dashboards", "Connected Power BI reports with clear data models and focused visuals.", ["Data modelling", "DAX measures", "Multi-page reports"]),
      service("data-visualization", "Data Visualization", "Charts and visual summaries that make findings easy to understand.", ["Chart design", "Report visuals", "Presentation-ready graphics"]),
      service("data-analysis", "Data Analysis", "Cleaning, exploring and interpreting data to find what matters.", ["Data cleaning", "Descriptive analysis", "Trend and comparison analysis"]),
      service("business-reporting", "Business Reporting", "Well-structured reports that turn business data into clear findings.", ["Performance reports", "Recurring report templates", "Executive summaries"]),
    ],
  },
  {
    slug: "academic-research-support",
    number: "02",
    title: "Academic & Research Support",
    short: "Guidance, editing and documentation that strengthen your own work.",
    description:
      "We help you plan, structure and present your own academic and professional writing. Our focus is guidance, editing and formatting that build your understanding and raise the quality of your work.",
    icon: "book",
    deliverables: [
      "Structured feedback or an edited document",
      "Formatting to your required style or template",
      "Clear notes explaining the suggested improvements",
    ],
    note: "We provide guidance, editing and learning support. You remain responsible for your own work and for following your institution's academic integrity rules.",
    faqs: [
      {
        question: "Will you complete my assignment for me?",
        answer:
          "No. We support your learning through guidance, editing and formatting. The work you submit should remain your own and meet your institution's rules.",
      },
      {
        question: "Can you follow a referencing style or template?",
        answer: "Yes. Share the required style or template when you submit your request.",
      },
    ],
    services: [
      service("report-writing-guidance", "Report Writing Guidance", "Support with planning, structuring and improving your reports.", ["Outline review", "Structure feedback", "Clarity improvements"]),
      service("case-study-support", "Case Study Support", "Guidance on approaching, organising and presenting a case study.", ["Framework guidance", "Structure review", "Feedback on drafts"]),
      service("advanced-report-editing", "Advanced Report Editing", "In-depth editing for clarity, flow, structure and consistency.", ["Language editing", "Flow and structure", "Consistency checks"]),
      service("assignment-report-guidance", "Assignment Report Guidance", "Help understanding the brief and strengthening your own report.", ["Brief interpretation", "Draft feedback", "Formatting review"]),
      service("research-documentation", "Research Documentation", "Help organising and formatting research documents and proposals.", ["Proposal structure", "Methodology layout", "Reference formatting"]),
      service("cv-preparation", "CV Preparation", "A clear, professional CV that presents your experience well.", ["New CV design", "CV rewrite", "Role-focused tailoring"]),
      service("typing-document-formatting", "Typing and Document Formatting", "Accurate typing and polished formatting for any document.", ["Typing from notes", "Template formatting", "Table of contents and styles"]),
    ],
  },
  {
    slug: "it-software-development",
    number: "03",
    title: "IT & Software Development",
    short: "Web apps, databases and data science, built with sound engineering.",
    description:
      "From a small business tool to a full web application, we design, build and document software that works reliably. We also help you debug problems and understand how your code works.",
    icon: "code",
    deliverables: [
      "Source code in a clean, organised repository",
      "Setup and usage documentation",
      "Handover support for running the project",
    ],
    faqs: [
      {
        question: "Which technologies do you work with?",
        answer: "Tell us your requirements and we will confirm the best fit, or work within the stack you already use.",
      },
      {
        question: "Can you fix an existing project?",
        answer: "Yes. Share the code and a description of the issue and we will assess it first.",
      },
    ],
    services: [
      service("web-application-development", "Web Application Development", "Responsive, database-backed web applications built around your workflow.", ["Business web apps", "Admin dashboards", "Customer-facing sites"]),
      service("software-development-projects", "Software Development Projects", "End-to-end software projects, from requirements to a working build.", ["Requirements analysis", "Application development", "Testing"]),
      service("database-development", "Database Development", "Well-designed databases that keep your data reliable and fast.", ["Schema design", "Queries and reports", "Data migration"]),
      service("programming-support", "Programming Support", "One-to-one help understanding concepts and improving your code.", ["Concept walkthroughs", "Code review", "Best-practice guidance"]),
      service("debugging-technical-assistance", "Debugging and Technical Assistance", "Find the cause of a problem and get your project running again.", ["Bug diagnosis", "Fixes", "Environment setup"]),
      service("data-science-projects", "Data Science Projects", "Exploration, modelling and evaluation of real-world datasets.", ["Data preparation", "Statistical analysis", "Insight reporting"]),
      service("machine-learning-projects", "Machine Learning Projects", "Practical models, trained and evaluated around a clear objective.", ["Model development", "Evaluation", "Explainability"]),
      service("technical-documentation", "IT-Related Technical Documentation", "Clear documentation for systems, code and technical processes.", ["System documentation", "User guides", "API documentation"]),
    ],
  },
  {
    slug: "presentation-graphic-design",
    number: "04",
    title: "Presentation & Graphic Design",
    short: "Slides, posters and documents designed to hold attention.",
    description:
      "Good ideas deserve clear design. We turn your content into presentations, posters, forms and documents that look professional and communicate quickly.",
    icon: "presentation",
    deliverables: [
      "Editable source files",
      "Export-ready PDF or print versions",
      "One consistent visual style throughout",
    ],
    faqs: [
      {
        question: "Can you use my university or company template?",
        answer: "Yes. Send the template or brand guidelines with your request.",
      },
      {
        question: "Will I receive editable files?",
        answer: "Yes. Editable files are provided wherever the format allows.",
      },
    ],
    services: [
      service("powerpoint-presentation-creation", "PowerPoint Presentation Creation", "Clear, polished slide decks built from your content.", ["New deck design", "Redesign of existing slides", "Custom templates"]),
      service("academic-poster-design", "Academic Poster Design", "Research posters that are organised, readable and print-ready.", ["Conference posters", "Layout design", "Print-ready export"]),
      service("research-presentation-design", "Research Presentation Design", "Presentations that communicate your research clearly.", ["Defence slides", "Data visuals", "Speaker flow"]),
      service("word-document-formatting", "Word Document Formatting", "Consistent styles, numbering, contents pages and layouts.", ["Heading styles", "Contents pages", "Page layout"]),
      service("excel-word-document-merging", "Excel and Word Document Merging", "Combine data and documents without manual copying.", ["Mail merge", "Document combining", "Automated letters"]),
      service("google-forms", "Google Forms", "Well-organised online forms for collecting responses.", ["Form building", "Response sheets", "Branching logic"]),
      service("survey-design", "Survey Design", "Surveys structured to collect clear and usable answers.", ["Question flow", "Scale design", "Response summaries"]),
    ],
  },
  {
    slug: "video-creative-studio",
    number: "05",
    title: "Video & Creative Studio",
    short: "Edited videos and creative content that tell your story.",
    description:
      "From quick social clips to complete promotional pieces, we shape footage into content with rhythm, clarity and a consistent visual style.",
    icon: "video",
    deliverables: [
      "Final video in your required formats",
      "Sizes prepared for each platform",
      "Review rounds as agreed in your quotation",
    ],
    faqs: [
      {
        question: "How do I send large footage files?",
        answer: "After your request is reviewed, we will share a suitable way to transfer large files.",
      },
      {
        question: "Do you shoot footage as well as edit?",
        answer: "Yes, subject to location and availability. Include your date and location in your request.",
      },
    ],
    services: [
      service("professional-video-editing", "Professional Video Editing", "Clean, well-paced edits with colour, sound and titles.", ["Long-form edits", "Colour and audio", "Titles and captions"]),
      service("promotional-videos", "Promotional Videos", "Short promotional videos that present a brand, product or event.", ["Brand videos", "Product videos", "Campaign edits"]),
      service("social-media-videos", "Social Media Videos", "Short vertical and square content made for social platforms.", ["Reels and shorts", "Captions", "Platform sizing"]),
      service("videography", "Videography", "On-location filming for projects, brands and events.", ["Planned shoots", "Interviews", "Project coverage"]),
      service("event-coverage", "Event Coverage", "Coverage and highlight edits of your event.", ["Full-event filming", "Highlight reels", "Same-format delivery"]),
      service("creative-content-production", "Creative Content Production", "Visual content planned and produced around your goals.", ["Content concepts", "Visual assets", "Campaign sets"]),
    ],
  },
];
