"use client";

import React from "react";
import { SectionHeading } from "./section-heading";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";
import { ScrollReveal } from "./scroll-reveal";

interface ProfileData {
  phone: string;
  email: string;
  linkedinUrl: string;
  jobdbUrl: string;
  githubUrl: string;
}

export function ContactContent({ profile }: { profile: ProfileData }) {
  const { locale } = useLocale();

  return (
    <main className="section-band animate-fade-in animate-duration-300 animate-ease-out animate-fill-both">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow={t(ui.contact.eyebrow, locale)}
          title={t(ui.contact.title, locale)}
          description={t(ui.contact.description, locale)}
        />

        <ScrollReveal delay={80}>
          <section className="contact-panel">
            <div>
              <p className="eyebrow">{t(ui.contact.labelPhone, locale)}</p>
              <a className="contact-chip" href={`tel:${profile.phone}`} aria-label={`Call ${profile.phone}`}>
                <span aria-hidden="true">☎</span>
                <span>{profile.phone}</span>
              </a>
            </div>
            <div>
              <p className="eyebrow">{t(ui.contact.labelEmail, locale)}</p>
              <a className="contact-chip" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}>
                <span aria-hidden="true">✉</span>
                <span>{t(ui.contact.emailMe, locale)}</span>
              </a>
            </div>
            <div>
              <p className="eyebrow">{t(ui.contact.labelLinkedIn, locale)}</p>
              <a
                className="contact-chip"
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open LinkedIn profile"
              >
                <span aria-hidden="true">in</span>
                <span>LinkedIn</span>
              </a>
            </div>
            {profile.jobdbUrl ? (
              <div>
                <p className="eyebrow">{t(ui.contact.labelJobsDB, locale)}</p>
                <a
                  className="contact-chip"
                  href={profile.jobdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open JobsDB profile"
                >
                  <span aria-hidden="true">J</span>
                  <span>JobsDB</span>
                </a>
              </div>
            ) : null}
            <div>
              <p className="eyebrow">{t(ui.contact.labelGitHub, locale)}</p>
              <a
                className="contact-chip"
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
              >
                <span aria-hidden="true">{"</>"}</span>
                <span>GitHub</span>
              </a>
            </div>
            <div className="rounded-none border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-5">
              <p className="text-sm leading-6 text-[color:var(--muted)]">
                {t(ui.contact.chatNote, locale)}
              </p>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
