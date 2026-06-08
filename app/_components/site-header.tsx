"use client";

import Image from "next/image";
import Link from "next/link";
import { profile as staticProfile } from "../_data/portfolio";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";

interface SiteHeaderProps {
  profile?: {
    name: string;
    avatarUrl?: string | null;
    avatarAlt?: string | null;
  } | null;
}

export function SiteHeader({ profile: dynamicProfile }: SiteHeaderProps) {
  const { locale, toggle } = useLocale();

  const name = dynamicProfile?.name ?? staticProfile.name;
  const avatarUrl = dynamicProfile?.avatarUrl ?? staticProfile.avatarUrl;
  const avatarAlt = dynamicProfile?.avatarAlt ?? staticProfile.avatarAlt ?? name;

  const navItems = [
    { href: "/", label: t(ui.nav.home, locale) },
    { href: "/projects", label: t(ui.nav.projects, locale) },
    { href: "/resume", label: t(ui.nav.resume, locale) },
    { href: "/contact", label: t(ui.nav.contact, locale) },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:var(--surface)]/90 backdrop-blur">
      <div className="site-header-inner mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5">
        <Link href="/" className="site-brand flex min-w-0 items-center gap-3" aria-label="Home">
          {avatarUrl ? (
            <span className="site-avatar">
              <Image
                src={avatarUrl}
                alt={avatarAlt}
                width={72}
                height={72}
                className="site-avatar-image"
                priority
              />
            </span>
          ) : (
            <span className="grid size-9 place-items-center border border-[color:var(--line-strong)] bg-[color:var(--ink)] text-sm font-semibold text-[color:var(--surface)]">
              TR
            </span>
          )}
          <span className="hidden text-sm font-medium text-[color:var(--ink)] sm:block">
            {name}
          </span>
        </Link>

        <nav className="site-nav flex min-w-0 items-center gap-1 text-sm text-[color:var(--muted)]">
          {navItems.map((item) => (
            <Link key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </Link>
          ))}

          {/* Language toggle */}
          <button
            id="locale-toggle"
            onClick={toggle}
            aria-label={t(ui.nav.toggleAriaLabel, locale)}
            className="locale-toggle ml-2 font-mono text-[11px] font-semibold tracking-widest px-2 py-1 rounded border border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--line-strong)] hover:text-[color:var(--ink)] transition-colors"
          >
            {t(ui.nav.toggleLang, locale)}
          </button>
        </nav>
      </div>
    </header>
  );
}
