"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";
import { ScrollReveal } from "./scroll-reveal";

interface ProfileData {
  name: string;
  headline: string;
  location: string;
  email: string;
  summary: string;
  avatarUrl?: string | null;
  avatarAlt: string;
  resumeUrl?: string | null;
}

interface ExperienceData {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

interface SkillData {
  group: string;
  items: string[];
}

interface ResumeContentProps {
  profile: ProfileData;
  experiences: ExperienceData[];
  skills: SkillData[];
}

export function ResumeContent({ profile, experiences, skills }: ResumeContentProps) {
  const { locale } = useLocale();
  const downloadResumeLabel = locale === "th" ? "ดาวน์โหลด Resume PDF" : "Download Resume PDF";
  return (
    <main className="section-band animate-fade-in animate-duration-300 animate-ease-out animate-fill-both">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading
          eyebrow={t(ui.resume.eyebrow, locale)}
          title={profile.headline}
          description={t(ui.resume.description, locale)}
        />

        <div className="space-y-8">
          {profile.avatarUrl ? (
            <ScrollReveal delay={50}>
              <section className="resume-block">
                <div className="resume-profile-head">
                  <div className="resume-profile-frame">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.avatarAlt}
                      width={360}
                      height={360}
                      className="resume-profile-image"
                    />
                  </div>
                  <div>
                    <h2>{profile.name}</h2>
                    <p>{profile.location}</p>
                    <p>{profile.email}</p>
                  </div>
                </div>
              </section>
            </ScrollReveal>
          ) : null}

          <ScrollReveal delay={100}>
            <section className="resume-block">
              <h2>{t(ui.resume.sectionSummary, locale)}</h2>
              <p>{profile.summary}</p>
              {profile.resumeUrl && profile.resumeUrl !== "/resume" ? (
                <div className="mt-6">
                  <a
                    className="btn-secondary"
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {downloadResumeLabel}
                  </a>
                </div>
              ) : null}
            </section>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <section className="resume-block">
              <h2>{t(ui.resume.sectionExperience, locale)}</h2>
              <div className="space-y-6">
                {experiences.map((item) => (
                  <article key={`${item.company}-${item.role}`}>
                    <p className="text-sm font-medium text-[color:var(--accent)]">{item.period}</p>
                    <h3>{item.role}</h3>
                    <p className="text-[color:var(--muted)]">{item.company}</p>
                    <ul>
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <section className="resume-block">
              <h2>{t(ui.resume.sectionSkills, locale)}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {skills.map((skill) => (
                  <div key={skill.group}>
                    <h3>{skill.group}</h3>
                    <p>{skill.items.join(" / ")}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal delay={250}>
            <section className="resume-block">
              <h2>{t(ui.resume.sectionEducation, locale)}</h2>
              <p>{t(ui.resume.educationDetail, locale)}</p>
            </section>
          </ScrollReveal>
        </div>
      </div>
    </main>
  );
}
