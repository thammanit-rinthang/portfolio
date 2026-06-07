"use client";

import React from "react";
import Link from "next/link";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";
import type { Project } from "../_data/portfolio";
import { ScrollReveal } from "./scroll-reveal";
import { ProjectGallery } from "./project-gallery";

export function ProjectDetailContent({ project }: { project: Project }) {
  const { locale } = useLocale();

  const sections = [
    { label: t(ui.projectDetail.sectionProblem, locale),    body: project.problem },
    { label: t(ui.projectDetail.sectionSolution, locale),   body: project.solution },
    { label: t(ui.projectDetail.sectionRole, locale),       body: project.role },
    { label: t(ui.projectDetail.sectionDeployment, locale), body: project.deployment },
    { label: t(ui.projectDetail.sectionOutcome, locale),    body: project.impact },
  ];

  return (
    <main className="section-band animate-fade-in animate-duration-300 animate-ease-out animate-fill-both">
      <article className="mx-auto w-full max-w-4xl px-5">
        <Link className="text-link" href="/projects">
          {t(ui.projectDetail.backLink, locale)}
        </Link>
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>{tag}</span>
            ))}
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight text-[color:var(--ink)] sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[color:var(--muted)]">{project.summary}</p>
        </div>

        {project.images && project.images.length > 0 ? (
          <ScrollReveal delay={60}>
            <ProjectGallery images={project.images} title={project.title} />
          </ScrollReveal>
        ) : null}

        <ScrollReveal delay={80}>
          <div className="case-study-grid mt-12">
            {sections.map(({ label, body }) => (
              <section key={label}>
                <h2>{label}</h2>
                <p>{body}</p>
              </section>
            ))}

            <section>
              <h2>{t(ui.projectDetail.sectionStack, locale)}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span className="stack-pill" key={item}>{item}</span>
                ))}
              </div>
            </section>
          </div>
        </ScrollReveal>

        {project.githubUrl ? (
          <div className="mt-12 border-t border-[color:var(--line)] pt-8">
            <a
              className="btn-secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(ui.projectDetail.viewGithub, locale)}
            </a>
          </div>
        ) : null}
      </article>
    </main>
  );
}
