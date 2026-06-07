export type Project = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  role: string;
  stack: string[];
  tags: string[];
  deployment: string;
  impact: string;
  githubUrl?: string;
  featured?: boolean;
  images?: {
    url: string;
    alt: string;
    isCover?: boolean;
  }[];
};

export const profile = {
  name: "Thammanit Rinthang",
  headline: "Full Stack Developer and IT Systems Engineer",
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
  summary:
    "I build internal business systems end to end, from requirements and application development to deployment, monitoring, and user support.",
  proof: [
    "Next.js, React, TypeScript, PostgreSQL",
    "Docker, Ubuntu Server, Nginx, Cloudflare",
    "Microsoft Entra ID and Graph API integration",
    "Production support for business users",
  ],
};

export const skills = [
  {
    group: "Product Delivery",
    items: ["Requirement gathering", "Workflow redesign", "User support"],
  },
  {
    group: "Frontend",
    items: ["Next.js App Router", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    group: "Backend and Data",
    items: ["Prisma ORM", "PostgreSQL", "MySQL", "REST APIs", "Microsoft Graph API"],
  },
  {
    group: "Infrastructure",
    items: ["Docker", "Ubuntu Server", "Nginx", "Cloudflare", "GitHub Actions"],
  },
  {
    group: "Enterprise IT",
    items: ["Microsoft Entra ID", "Active Directory", "Synology NAS", "ERP Support"],
  },
];

export const experiences = [
  {
    role: "IT Programmer",
    company: "NDC Industrial Co., Ltd.",
    period: "May 2025 - Present",
    highlights: [
      "Developed internal web applications to reduce paper-based workflows.",
      "Managed Docker, Nginx, SSL, Cloudflare DNS, and production maintenance.",
      "Supported Microsoft Entra ID, Active Directory, ERP systems, and 60+ users.",
    ],
  },
  {
    role: "IT Officer Intern",
    company: "Thai Nitrate Co., Ltd. (TNC)",
    period: "Jan 2025 - May 2025",
    highlights: [
      "Built internal applications with Next.js, PostgreSQL, MS SQL Server, and Supabase.",
      "Integrated process deviation workflows with Microsoft Entra ID.",
      "Created parking booking and ISO document workflow tools.",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "qms-system",
    title: "QMS System",
    summary:
      "A quality management workflow system for internal operations and document-driven processes.",
    problem:
      "Quality workflows often depend on manual tracking, scattered files, and status updates that are hard to follow.",
    solution:
      "Built a structured internal system that centralizes workflow status, records, and operational visibility.",
    role: "Full-stack development, workflow design, deployment planning",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
    tags: ["Internal Tool", "Production Workflow", "Next.js", "PostgreSQL"],
    deployment:
      "Designed for server deployment with reverse proxy, SSL, and operational monitoring in mind.",
    impact:
      "Helps move quality-related work from paper and scattered files into a searchable system.",
    githubUrl: "https://github.com/thammanit-rinthang/qms-system",
    featured: true,
  },
  {
    slug: "it-management",
    title: "IT Management",
    summary:
      "An internal operations tool for IT support, assets, tasks, and day-to-day service tracking.",
    problem:
      "IT support work can become hard to prioritize when requests, devices, and fixes are tracked manually.",
    solution:
      "Created a system-oriented view of IT work so support tasks and operational records are easier to manage.",
    role: "System design, full-stack development, IT operations mapping",
    stack: ["TypeScript", "Next.js", "PostgreSQL", "Prisma"],
    tags: ["IT Operations", "Internal Tool", "Support Workflow"],
    deployment:
      "Prepared for internal network use with server-side deployment and controlled access patterns.",
    impact:
      "Turns recurring IT work into visible, manageable records that support faster follow-up.",
    githubUrl: "https://github.com/thammanit-rinthang/it-management",
    featured: true,
  },
  {
    slug: "training-management",
    title: "Training Management",
    summary:
      "A training workflow system for organizing employee training records and operational learning activities.",
    problem:
      "Training records are difficult to review when attendance, topics, and status are stored across documents.",
    solution:
      "Built a focused workflow for training data, making records easier to browse and maintain.",
    role: "Application development and workflow modeling",
    stack: ["TypeScript", "Next.js", "PostgreSQL"],
    tags: ["Business Workflow", "Internal Tool", "Training"],
    deployment:
      "Designed as an internal application that can be deployed with the same production approach as other tools.",
    impact:
      "Improves visibility of training records and reduces the effort needed to manage learning workflows.",
    githubUrl: "https://github.com/thammanit-rinthang/training-management",
    featured: true,
  },
  {
    slug: "car-parking-thainitrate",
    title: "Car Parking Booking",
    summary:
      "A parking slot booking system for employees, built during the Thai Nitrate internship period.",
    problem:
      "Parking reservations need a simple shared system to avoid manual coordination and unclear availability.",
    solution:
      "Created a booking flow that lets employees reserve slots and see operational availability.",
    role: "Full-stack application development",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase"],
    tags: ["Reservation", "Internal Tool", "Supabase"],
    deployment: "Supported internal deployment through Nginx-based application hosting.",
    impact:
      "Makes parking allocation easier to coordinate and reduces repeated manual communication.",
    githubUrl: "https://github.com/thammanit-rinthang/car_parking_thainitrate",
  },
  {
    slug: "process-deviation",
    title: "Process Deviation",
    summary:
      "A process deviation reporting system integrated with Microsoft Entra ID for internal reporting workflows.",
    problem:
      "Deviation reports need clear ownership, identity integration, and reliable status tracking.",
    solution:
      "Built an internal reporting system connected to Microsoft identity workflows for better traceability.",
    role: "Application development and Microsoft integration",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Microsoft Entra ID", "Graph API"],
    tags: ["Microsoft Integration", "Internal Tool", "Reporting"],
    deployment: "Supported internal deployment with Nginx and enterprise identity integration.",
    impact:
      "Improves traceability for process-related reporting and supports more consistent follow-up.",
    githubUrl: "https://github.com/thammanit-rinthang/process_devietion",
  },
];

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
