"use client";

import React from "react";
import Link from "next/link";
import { ProjectCard } from "./project-card";
import { SectionHeading } from "./section-heading";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";
import type { Project } from "../_data/portfolio";

interface ProfileData {
  name: string;
  summary: string;
  proof: string[];
}

interface SkillData {
  group: string;
  items: string[];
}

interface ExperienceData {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

interface HomeContentProps {
  profile: ProfileData;
  skills: SkillData[];
  experiences: ExperienceData[];
  featuredProjects: Project[];
}

const VISUAL_ITEMS = {
  en: ["Profile", "Projects", "Skills", "Experience", "Deployment", "Support"],
  th: ["โปรไฟล์", "โปรเจกต์", "ทักษะ", "ประสบการณ์", "การ Deploy", "Support"],
};

export function HomeContent({ profile, skills, experiences, featuredProjects }: HomeContentProps) {
  const { locale } = useLocale();
  const visualItems = VISUAL_ITEMS[locale] ?? VISUAL_ITEMS.en;
  const landingProjects = featuredProjects.slice(0, 3);

  return (
    <main className="stack-landing">
      <section className="stack-screen stack-screen-hero">
        <div className="stack-surface hero-shell">
          <div className="hero-content mx-auto grid h-full w-full max-w-6xl gap-12 px-5 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-16">
            <div className="hero-copy animate-fade-up animate-duration-300 animate-ease-out animate-fill-both">
              <p className="eyebrow">{t(ui.hero.eyebrow, locale)}</p>
              <h1 className="hero-title mt-5 max-w-4xl font-semibold leading-[1.02] text-[color:var(--ink)]">
                {profile.name}
              </h1>
              <p className="hero-summary mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
                {profile.summary}
              </p>
              <div className="hero-actions mt-9 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" href="/projects">
                  {t(ui.hero.ctaProjects, locale)}
                </Link>
                <Link className="btn-secondary" href="/resume">
                  {t(ui.hero.ctaResume, locale)}
                </Link>
              </div>
            </div>

            <div
              className="visual-panel animate-fade-up animate-duration-300 animate-delay-100 animate-ease-out animate-fill-both"
              aria-label={t(ui.hero.visualLabel, locale)}
            >
              <div className="visual-panel-header">
                <span>{t(ui.hero.visualTitle, locale)}</span>
                <span>{t(ui.hero.visualSource, locale)}</span>
              </div>
              <div className="visual-grid">
                {visualItems.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="signal-list">
                {profile.proof.map((item) => (
                  <div key={item}>
                    <span />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-screen stack-screen-projects">
        <div className="stack-surface stack-surface-light stack-featured">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center px-5 py-12">
            <SectionHeading
              eyebrow={t(ui.sections.selectedWork.eyebrow, locale)}
              title={t(ui.sections.selectedWork.title, locale)}
              description={t(ui.sections.selectedWork.description, locale)}
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {landingProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
            <div className="mt-8 flex justify-start">
              <Link className="btn-secondary" href="/projects">
                {t(ui.hero.ctaProjects, locale)}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="stack-screen stack-screen-skills">
        <div className="stack-surface stack-surface-muted">
          <div className="mx-auto grid h-full w-full max-w-6xl content-center gap-10 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow={t(ui.sections.capability.eyebrow, locale)}
              title={t(ui.sections.capability.title, locale)}
              description={t(ui.sections.capability.description, locale)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill) => (
                <div className="compact-panel" key={skill.group}>
                  <h3>{skill.group}</h3>
                  <p>{skill.items.join(" / ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="stack-screen stack-screen-experience">
        <div className="stack-surface stack-surface-soft">
          <div className="mx-auto grid h-full w-full max-w-6xl content-center gap-10 px-5 py-12 lg:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading
              eyebrow={t(ui.sections.experience.eyebrow, locale)}
              title={t(ui.sections.experience.title, locale)}
              description={t(ui.sections.experience.description, locale)}
            />
            <div className="timeline">
              {experiences.map((item) => (
                <article key={`${item.company}-${item.role}`}>
                  <p>{item.period}</p>
                  <h3>{item.role}</h3>
                  <h4>{item.company}</h4>
                  <ul>
                    {item.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
