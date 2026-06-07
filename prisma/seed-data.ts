export const seededProfile = {
  name: "Thammanit Rinthang",
  headline: "Full Stack Developer and IT Systems Engineer",
  summary:
    "Full Stack Developer and IT Systems Engineer with hands-on experience designing, developing, deploying, and maintaining internal business applications and IT infrastructure. Experienced in building production web applications using Next.js, React, TypeScript, and PostgreSQL, while managing Linux servers, Docker environments, CI/CD workflows, Microsoft Entra ID, and enterprise systems. Proven ability to deliver end-to-end solutions from requirement gathering and system design to deployment, support, and continuous improvement.",
  location: "Thailand",
  phone: "0928287574",
  email: "thammanitrinthang@gmail.com",
  githubUrl: "https://github.com/thammanit-rinthang",
  linkedinUrl: "https://www.linkedin.com/in/thammanit-rinthang-14016535b/",
  jobdbUrl: "https://th.jobsdb.com/profiles/%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%99%E0%B8%B4%E0%B8%95%E0%B8%A2%E0%B9%8C-%E0%B8%A3%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%B2%E0%B8%87-QLyDySpNCs",
  avatarUrl: "/profile/thammanit-rinthang.png",
  avatarPath: "public/profile/thammanit-rinthang.png",
  avatarAlt: "Portrait of Thammanit Rinthang",
  resumeUrl: "/resume",
};

export const seededSkills = [
  { name: "Next.js (App Router)", category: "Frontend & UI", priority: 10 },
  { name: "React", category: "Frontend & UI", priority: 20 },
  { name: "TypeScript", category: "Frontend & UI", priority: 30 },
  { name: "Tailwind CSS", category: "Frontend & UI", priority: 40 },
  { name: "Power Apps", category: "Frontend & UI", priority: 50 },
  { name: "Prisma ORM", category: "Backend & Databases", priority: 60 },
  { name: "PostgreSQL", category: "Backend & Databases", priority: 70 },
  { name: "MySQL", category: "Backend & Databases", priority: 80 },
  { name: "TiDB", category: "Backend & Databases", priority: 90 },
  { name: "REST APIs", category: "Backend & Databases", priority: 100 },
  { name: "Microsoft Graph API", category: "Backend & Databases", priority: 110 },
  { name: "Docker", category: "Infrastructure & DevOps", priority: 120 },
  { name: "Ubuntu Server", category: "Infrastructure & DevOps", priority: 130 },
  { name: "Nginx", category: "Infrastructure & DevOps", priority: 140 },
  { name: "Cloudflare", category: "Infrastructure & DevOps", priority: 150 },
  { name: "Synology NAS", category: "Infrastructure & DevOps", priority: 160 },
  { name: "Git", category: "Infrastructure & DevOps", priority: 170 },
  { name: "GitHub Actions (CI/CD)", category: "Infrastructure & DevOps", priority: 180 },
  { name: "Vercel", category: "Infrastructure & DevOps", priority: 190 },
  { name: "Microsoft Entra ID (Azure AD)", category: "Identity & Security", priority: 200 },
  { name: "Active Directory", category: "Identity & Security", priority: 210 },
  { name: "RBAC", category: "Identity & Security", priority: 220 },
  { name: "Claude Code", category: "AI-Assisted Development", priority: 230 },
  { name: "Codex", category: "AI-Assisted Development", priority: 240 },
  { name: "Ollama", category: "AI-Assisted Development", priority: 250 },
  { name: "LLM Studio", category: "AI-Assisted Development", priority: 260 },
  { name: "NotebookLM", category: "AI-Assisted Development", priority: 270 },
  { name: "OpenRouter", category: "AI-Assisted Development", priority: 280 },
  { name: "Google AI Studio", category: "AI-Assisted Development", priority: 290 },
  { name: "System Administration", category: "IT Operations", priority: 300 },
  { name: "Network Support", category: "IT Operations", priority: 310 },
  { name: "ERP Support", category: "IT Operations", priority: 320 },
  { name: "Hardware & Software Troubleshooting", category: "IT Operations", priority: 330 },
];

export const seededExperiences = [
  {
    company: "NDC Industrial Co., Ltd.",
    role: "IT Programmer",
    periodLabel: "May 2025 - Present",
    summary:
      "Developed and maintained internal web applications to replace paper-based processes and improve workflow efficiency.",
    highlights: [
      "Gathered requirements from users and departments to design systems that support daily operations.",
      "Deployed and managed applications on Ubuntu Server using Docker and Nginx.",
      "Managed the full deployment lifecycle of internal applications, including server setup, Docker configuration, reverse proxy management, SSL setup, and ongoing maintenance.",
      "Managed Cloudflare DNS, SSL certificates, domains, and related network services.",
      "Maintained Microsoft Entra ID (Azure AD), Active Directory, Synology NAS, ERP systems, and internal infrastructure.",
      "Implemented monitoring using Uptime Kuma with Microsoft Teams notifications.",
      "Provided IT support for more than 60 users covering hardware, software, networking, and enterprise applications.",
      "Troubleshot and resolved application, server, and infrastructure issues.",
      "Used AI-assisted development tools to accelerate development, debugging, documentation, and research.",
    ],
    sortOrder: 10,
  },
  {
    company: "Thai Nitrate Co., Ltd. (TNC)",
    role: "IT Officer Intern",
    periodLabel: "Jan 2025 - May 2025",
    summary:
      "Developed internal web applications using Next.js and integrated with PostgreSQL, MS SQL Server, and Supabase.",
    highlights: [
      "Built a process deviation reporting system integrated with Microsoft Entra ID (Azure AD).",
      "Redesigned ISO document registration workflows using Microsoft Power Apps.",
      "Developed a parking slot booking system for internal employees.",
      "Supported application deployment using Nginx.",
      "Integrated internal applications with Microsoft Graph API.",
    ],
    sortOrder: 20,
  },
  {
    company: "Mae Fah Luang University",
    role: "Software Engineering Bootcamp Mentor",
    periodLabel: "University Activity",
    summary: "Guided first-year students in software engineering fundamentals.",
    highlights: [
      "Supported first-year students with software engineering fundamentals.",
      "Contributed as a mentor in a software engineering bootcamp setting.",
    ],
    sortOrder: 30,
  },
];

export const seededProjects = [
  {
    slug: "qms-system",
    title: "QMS System",
    summary:
      "A quality management system with a digital approval workflow for internal business operations.",
    problem:
      "Quality and approval processes are harder to follow when documents, status updates, and approvals are spread across manual steps or disconnected tools.",
    solution:
      "Built a centralized workflow system for quality records and digital approvals with modern web architecture, authentication, and Microsoft integrations.",
    role: "Full-stack development, workflow design, and deployment planning",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "DaisyUI", "NextAuth.js", "Microsoft Graph API"],
    deployment: "Designed for Ubuntu Server with Docker, and also prepared for Vercel-based deployment.",
    impact:
      "Improves visibility of quality workflows, reduces manual approval bottlenecks, and creates a stronger digital trail for internal operations.",
    githubUrl: "https://github.com/thammanit-rinthang/qms-system",
    demoUrl: null,
    isFeatured: true,
    sortOrder: 10,
    tags: ["Quality Management", "Approval Workflow", "Internal Tool", "PostgreSQL", "Microsoft Graph API"],
  },
  {
    slug: "e-signature",
    title: "E-Signature",
    summary:
      "A digital signature and document workflow project built with Next.js, Prisma, and PDF tooling.",
    problem:
      "Document approval and signing workflows become slow and difficult to track when signatures and generated files are handled manually.",
    solution:
      "Built a web-based e-signature workflow with authentication, PDF processing, and supporting background services for document handling.",
    role: "Full-stack application development",
    stack: ["Next.js", "Prisma", "PostgreSQL", "NextAuth.js", "pdf-lib", "react-pdf", "Supabase", "Inngest", "Redis"],
    deployment: "Built as a server-backed application with background processing and error monitoring support.",
    impact:
      "Moves document signing toward a more structured digital workflow with authenticated access and PDF-based output handling.",
    githubUrl: "https://github.com/thammanit-rinthang/e-signature",
    demoUrl: null,
    isFeatured: true,
    sortOrder: 20,
    tags: ["E-Signature", "Document Workflow", "PDF", "Internal Tool", "NextAuth"],
  },
  {
    slug: "it-management",
    title: "IT Management",
    summary:
      "An internal IT operations system for managing support work, records, exports, and operational visibility.",
    problem:
      "IT requests, asset records, and support history are harder to follow when daily work is tracked manually across chats, files, and ad hoc notes.",
    solution:
      "Built an internal management application for organizing IT-related records, status tracking, reporting, and operational dashboards.",
    role: "System design, full-stack development, and IT operations mapping",
    stack: ["Next.js", "Prisma", "PostgreSQL", "NextAuth.js", "Tailwind CSS", "Recharts", "ExcelJS", "React PDF"],
    deployment: "Designed as a secured internal web application with authenticated access and export/reporting support.",
    impact:
      "Makes recurring IT work easier to manage and review by turning support activity into structured records and reports.",
    githubUrl: "https://github.com/thammanit-rinthang/it-management",
    demoUrl: null,
    isFeatured: true,
    sortOrder: 30,
    tags: ["IT Operations", "Internal Tool", "Reporting", "Dashboard", "Authenticated App"],
  },
  {
    slug: "training-management",
    title: "Training Management System",
    summary:
      "A full-stack training management system for employee training history, course records, certificates, and reporting.",
    problem:
      "Training history, course data, and certificates become difficult to maintain when records are stored in scattered files or handled manually.",
    solution:
      "Built a centralized training management application with employee tracking, course management, certificate handling, PDF reporting, and RLS-backed access control.",
    role: "Full-stack development and workflow modeling",
    stack: ["Next.js", "PostgreSQL", "Supabase", "Prisma", "Tailwind CSS", "React PDF", "jsPDF", "NextAuth.js"],
    deployment: "Designed around Supabase-backed PostgreSQL with security controls and document generation for internal use.",
    impact:
      "Improves visibility of training records and reduces the effort needed to maintain employee training workflows and reports.",
    githubUrl: "https://github.com/thammanit-rinthang/training-management",
    demoUrl: null,
    isFeatured: true,
    sortOrder: 40,
    tags: ["Training", "Internal Tool", "PDF Reporting", "Supabase", "RLS"],
  },
  {
    slug: "next-r3f",
    title: "Next_R3F",
    summary:
      "A Next.js and React Three Fiber project for interactive 3D web experiences with animation-focused frontend work.",
    problem:
      "Rich interactive landing pages and visual demos often need more immersive motion and 3D presentation than standard UI pages can provide.",
    solution:
      "Built an experimental 3D frontend project using React Three Fiber, Drei, Rapier, and GSAP to explore interactive motion and scene-based experiences on the web.",
    role: "Frontend development and 3D interaction prototyping",
    stack: ["Next.js", "React Three Fiber", "Three.js", "Drei", "Rapier", "GSAP", "Supabase", "Zod"],
    deployment: "Built as a Next.js frontend project with interactive browser-side rendering and animation tooling.",
    impact:
      "Expands frontend capability into motion-heavy and 3D interaction work that can support richer product demos and visual storytelling.",
    githubUrl: "https://github.com/thammanit-rinthang/Next_R3F",
    demoUrl: null,
    isFeatured: false,
    sortOrder: 50,
    tags: ["3D", "Frontend", "Animation", "Three.js", "React Three Fiber"],
  },
  {
    slug: "car-parking-thainitrate",
    title: "Car Parking Booking",
    summary:
      "A parking slot booking system for internal employee use during the Thai Nitrate internship period.",
    problem:
      "Parking allocation becomes inefficient when reservations depend on manual coordination and there is no shared view of slot availability.",
    solution:
      "Built a web-based reservation workflow to help employees book parking slots and reduce repeated manual communication.",
    role: "Full-stack application development",
    stack: ["Next.js", "React", "Axios", "Tailwind CSS"],
    deployment: "Built as an internal web application suitable for lightweight internal deployment.",
    impact:
      "Makes parking coordination easier by replacing ad hoc booking communication with a clearer booking flow.",
    githubUrl: "https://github.com/thammanit-rinthang/car_parking_thainitrate",
    demoUrl: null,
    isFeatured: false,
    sortOrder: 60,
    tags: ["Booking System", "Internal Tool", "Reservation", "Employee Workflow"],
  },
  {
    slug: "process-deviation",
    title: "Process Deviation",
    summary:
      "A process deviation reporting system for internal reporting workflows with Microsoft identity integration.",
    problem:
      "Deviation reporting needs clear ownership, identity-aware access, and reliable follow-up tracking to avoid fragmented incident handling.",
    solution:
      "Built an internal reporting workflow connected to Microsoft authentication and Graph-based enterprise tooling to support traceable process deviation management.",
    role: "Application development and Microsoft integration",
    stack: ["Next.js", "Prisma", "Supabase", "MSAL", "Microsoft Graph API", "NextAuth.js", "Tailwind CSS", "React Hook Form"],
    deployment: "Built as an authenticated internal application with Microsoft ecosystem integration and form-driven reporting flows.",
    impact:
      "Improves traceability for deviation reports and supports more consistent follow-up in internal process reporting.",
    githubUrl: "https://github.com/thammanit-rinthang/process_devietion",
    demoUrl: null,
    isFeatured: true,
    sortOrder: 70,
    tags: ["Process Deviation", "Microsoft Integration", "Internal Tool", "Reporting", "Entra ID"],
  },
  {
    slug: "debt-management-tracking-system",
    title: "Debt Management & Tracking System",
    summary:
      "A senior project focused on debt management, tracking, status management, reporting, and debtor location visualization.",
    problem:
      "Debt collection and follow-up work needs clear status tracking, reporting, and location visibility to support day-to-day operations.",
    solution:
      "Built a full-stack debt management system with debtor tracking, map-based visualization, and reporting workflows.",
    role: "Senior Project - Full-stack development",
    stack: ["Nuxt.js", "NestJS", "MySQL", "TiDB", "Google Maps API"],
    deployment: "Academic project environment",
    impact:
      "Delivered a working end-to-end system with debt tracking, status management, reporting, and location-based visualization.",
    githubUrl: null,
    demoUrl: null,
    isFeatured: false,
    sortOrder: 80,
    tags: ["Senior Project", "Full Stack", "MySQL", "TiDB", "Google Maps API"],
  },
];
