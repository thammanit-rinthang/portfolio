"use client";

import Link from "next/link";
import { profile } from "../_data/portfolio";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";

export function SiteFooter() {
  const { locale } = useLocale();
  const summary =
    locale === "th"
      ? "เว็บไซต์ Portfolio ที่มีระบบจัดการคอนเทนต์หลังบ้านและ Portfolio Chat พัฒนาด้วย Next.js, TypeScript, Prisma, Supabase และ PostgreSQL"
      : "Portfolio website with admin content management and portfolio chat, built with Next.js, TypeScript, Prisma, Supabase, and PostgreSQL.";

  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--surface-muted)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>{summary}</p>
        <div className="flex gap-4">
          <Link className="text-link" href="/projects">
            {t(ui.footer.projects, locale)}
          </Link>
          <a className="text-link" href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <Link className="text-link" href="/contact">
            {t(ui.footer.contact, locale)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
