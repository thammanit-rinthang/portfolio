/**
 * Site-wide bilingual copy dictionary.
 * All public-facing UI strings live here so TH/EN is consistent in one place.
 * Tech names (React, Next.js, etc.) stay in English in both locales.
 */

export type Locale = "th" | "en";

export const ui = {
  // ── Navigation ────────────────────────────────────────────────────
  nav: {
    home:     { en: "Home",     th: "หน้าหลัก" },
    projects: { en: "Projects", th: "โปรเจกต์" },
    resume:   { en: "Resume",   th: "เรซูเม่" },
    contact:  { en: "Contact",  th: "ติดต่อ" },
    toggleLang: { en: "TH", th: "EN" },
    toggleAriaLabel: { en: "Switch to Thai", th: "Switch to English" },
  },

  // ── Hero / Home ────────────────────────────────────────────────────
  hero: {
    eyebrow:   { en: "Full Stack Developer / IT Systems", th: "นักพัฒนา Full Stack / ระบบ IT" },
    ctaProjects: { en: "View Projects", th: "ดูโปรเจกต์" },
    ctaResume:   { en: "Read Resume",   th: "อ่านเรซูเม่" },
    visualLabel: { en: "Portfolio system overview", th: "ภาพรวมระบบ Portfolio" },
    visualTitle: { en: "Portfolio Chat Context",    th: "บริบทแชต Portfolio" },
    visualSource: { en: "Source: verified content", th: "แหล่งที่มา: ข้อมูลยืนยันแล้ว" },
  },

  // ── Section headings ──────────────────────────────────────────────
  sections: {
    selectedWork: {
      eyebrow:     { en: "Selected work",     th: "ผลงานที่เลือก" },
      title:       { en: "Internal systems with business context", th: "ระบบภายในที่มีบริบทธุรกิจจริง" },
      description: {
        en: "Each project is framed as a case study: problem, solution, stack, deployment, and outcome.",
        th: "แต่ละโปรเจกต์นำเสนอเป็น case study: ปัญหา วิธีแก้ tech stack การ deploy และผลลัพธ์",
      },
    },
    capability: {
      eyebrow:     { en: "Capability",    th: "ความสามารถ" },
      title:       { en: "Software delivery with operations ownership", th: "ส่งมอบซอฟต์แวร์และดูแลระบบตั้งแต่ต้นจนจบ" },
      description: {
        en: "The strongest signal is not only building applications, but also deploying, maintaining, and supporting them in real environments.",
        th: "สิ่งที่แสดงความสามารถได้ชัดที่สุดคือการสร้าง deploy ดูแล และ support ระบบในสภาพแวดล้อมจริง",
      },
    },
    experience: {
      eyebrow:     { en: "Experience",    th: "ประสบการณ์" },
      title:       { en: "Built around daily business operations", th: "สร้างจากงานธุรกิจจริงทุกวัน" },
      description: {
        en: "Experience spans requirement gathering, app development, deployment, Microsoft identity, and end-user support.",
        th: "ครอบคลุมการรวบรวมความต้องการ พัฒนาแอป deploy ระบบ Microsoft identity และ support ผู้ใช้",
      },
    },
  },

  // ── Projects page ─────────────────────────────────────────────────
  projects: {
    eyebrow:     { en: "Projects",    th: "โปรเจกต์" },
    title:       { en: "Case studies from real workflows", th: "Case study จากงานจริง" },
    description: {
      en: "A focused view of internal tools, business workflows, deployment, and enterprise integration work.",
      th: "มุมมองเชิงลึกของ internal tools, business workflows, การ deploy และงาน enterprise integration",
    },
  },

  // ── Project detail page ───────────────────────────────────────────
  projectDetail: {
    backLink:          { en: "Back to projects",  th: "กลับสู่โปรเจกต์" },
    sectionProblem:    { en: "Business problem",  th: "ปัญหาทางธุรกิจ" },
    sectionSolution:   { en: "Solution",          th: "วิธีแก้ปัญหา" },
    sectionRole:       { en: "Role",              th: "บทบาท" },
    sectionDeployment: { en: "Deployment",        th: "การ Deployment" },
    sectionOutcome:    { en: "Outcome",           th: "ผลลัพธ์" },
    sectionStack:      { en: "Stack",             th: "Tech Stack" },
    viewGithub:        { en: "View GitHub",       th: "ดูบน GitHub" },
  },

  // ── Resume page ───────────────────────────────────────────────────
  resume: {
    eyebrow:          { en: "Resume",              th: "เรซูเม่" },
    description:      {
      en: "A compact resume view focused on full-stack delivery, deployment, and internal systems.",
      th: "เรซูเม่แบบกระชับ เน้นการส่งมอบ full-stack, deployment และ internal systems",
    },
    sectionSummary:   { en: "Professional Summary", th: "สรุปอาชีพ" },
    sectionExperience:{ en: "Experience",           th: "ประสบการณ์" },
    sectionSkills:    { en: "Skills",               th: "ทักษะ" },
    sectionEducation: { en: "Education",            th: "การศึกษา" },
    educationDetail:  {
      en: "Mae Fah Luang University, Bachelor of Engineering in Software Engineering. 1st Place Winner, Startup Technology Hackathon. Software Engineering Bootcamp Mentor.",
      th: "มหาวิทยาลัยแม่ฟ้าหลวง วิศวกรรมศาสตรบัณฑิต สาขาวิศวกรรมซอฟต์แวร์ รางวัลที่ 1 Startup Technology Hackathon วิทยากร Software Engineering Bootcamp",
    },
  },

  // ── Contact page ──────────────────────────────────────────────────
  contact: {
    eyebrow:     { en: "Contact",    th: "ติดต่อ" },
    title:       { en: "Open to full-stack and internal systems roles", th: "เปิดรับโอกาสงาน full-stack และระบบภายใน" },
    description: {
      en: "Best fit: teams that need someone who can build business tools and keep them running.",
      th: "เหมาะสุดสำหรับทีมที่ต้องการคนที่สร้างเครื่องมือธุรกิจและดูแลให้ระบบทำงานต่อเนื่อง",
    },
    labelPhone:    { en: "Phone",    th: "โทรศัพท์" },
    labelEmail:    { en: "Email",    th: "อีเมล" },
    labelLinkedIn: { en: "LinkedIn", th: "LinkedIn" },
    labelJobsDB:   { en: "JobsDB",   th: "JobsDB" },
    labelGitHub:   { en: "GitHub",   th: "GitHub" },
    emailMe:       { en: "Email Me", th: "ส่งอีเมล" },
    chatNote: {
      en: "Ask the Portfolio Chat about projects, tech stack, deployment, and resume details — all sourced from verified portfolio data.",
      th: "ลองถาม Portfolio Chat เกี่ยวกับโปรเจกต์ tech stack การ deploy และรายละเอียดเรซูเม่ ข้อมูลทั้งหมดมาจาก portfolio ที่ยืนยันแล้ว",
    },
  },

  // ── Footer ────────────────────────────────────────────────────────
  footer: {
    tagline: {
      en: "Built to demonstrate real systems work: product, code, deployment, and support.",
      th: "สร้างขึ้นเพื่อแสดงงานระบบจริง: product, code, deployment และ support",
    },
    projects: { en: "Projects", th: "โปรเจกต์" },
    contact:  { en: "Contact",  th: "ติดต่อ" },
  },

  // ── Chat panel ────────────────────────────────────────────────────
  chat: {
    panelTitle:      { en: "Portfolio Assistant", th: "ถามข้อมูลโปรไฟล์" },
    sourceLabel:     { en: "Source: Verified Content", th: "แหล่งข้อมูล: ยืนยันแล้ว" },
    closeChat:       { en: "Close chat", th: "ปิดแชต" },
    openChat:        { en: "Open portfolio chat", th: "เปิดแชต portfolio" },
    you:             { en: "You", th: "คุณ" },
    assistant:       { en: "Portfolio Assistant", th: "ผู้ช่วย Portfolio" },
    suggestedLabel:  { en: "Suggested Questions:", th: "คำถามแนะนำ:" },
    placeholder:     { en: "Ask a question... (Enter to send)", th: "พิมพ์คำถาม... (Enter เพื่อส่ง)" },
    loading:         { en: "Looking up details…", th: "กำลังค้นข้อมูล…" },
    errorTitle:      { en: "Error", th: "เกิดข้อผิดพลาด" },
    relatedLinks:    { en: "Related links:", th: "ลิงก์ที่เกี่ยวข้อง:" },
    welcome: {
      en: "Hello! I'm Thammanit's portfolio assistant. Ask me about his skills, experience, or projects.",
      th: "สวัสดีครับ! ผมช่วยตอบข้อมูล Portfolio ของธรรมนิตย์ ถามเรื่องทักษะ ประสบการณ์ หรือโปรเจกต์ได้เลยครับ",
    },
    queryError: {
      en: "Failed to query the assistant.",
      th: "ไม่สามารถส่งคำถามถึงผู้ช่วยได้",
    },
    fallbackError: {
      en: "Something went wrong. Please try again.",
      th: "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง",
    },
    suggestedPrompts: {
      en: [
        "What is his tech stack?",
        "Show his featured projects.",
        "Summarize his work experience.",
        "How does he deploy applications?",
      ],
      th: [
        "ทักษะและความเชี่ยวชาญมีอะไรบ้าง?",
        "แนะนำโปรเจกต์เด่นหน่อย",
        "สรุปประสบการณ์การทำงานสั้นๆ",
        "ดูแลและ Deploy ระบบอย่างไร?",
      ],
    },
  },
  // ── Metadata ──────────────────────────────────────────────────────
  metadata: {
    home: {
      title: { en: "Thammanit Rinthang | Full Stack Developer", th: "ธรรมนิตย์ รินทาง | นักพัฒนา Full Stack" },
      description: {
        en: "Full Stack Developer and IT Systems Engineer building internal business systems from requirements to production.",
        th: "นักพัฒนา Full Stack และวิศวกรระบบ IT สร้างระบบธุรกิจภายในตั้งแต่ความต้องการจนถึงโปรดักชัน"
      }
    },
    projects: {
      title: { en: "Projects", th: "โปรเจกต์" },
      description: {
        en: "Selected internal systems and full-stack project case studies.",
        th: "Case study โปรเจกต์ระบบภายในและ full-stack"
      }
    },
    resume: {
      title: { en: "Resume", th: "เรซูเม่" },
      description: {
        en: "Resume for Full Stack Developer and IT Systems Engineer roles.",
        th: "เรซูเม่นักพัฒนา Full Stack และวิศวกรระบบ IT"
      }
    },
    contact: {
      title: { en: "Contact", th: "ติดต่อ" },
      description: {
        en: "Contact Thammanit for Full Stack Developer and IT Systems roles.",
        th: "ติดต่อสำหรับตำแหน่ง Full Stack Developer และระบบ IT"
      }
    }
  },
} as const;

/** Pick the correct string for the current locale. */
export function t(entry: { en: string; th: string }, locale: Locale): string {
  return entry[locale] ?? entry.en;
}
