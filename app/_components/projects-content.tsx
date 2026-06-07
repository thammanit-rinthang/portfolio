"use client";

import React from "react";
import { ProjectCard } from "./project-card";
import { SectionHeading } from "./section-heading";
import { useLocale } from "../_lib/locale-context";
import { ui, t } from "../_lib/locale";
import type { Project } from "../_data/portfolio";
import { ScrollReveal } from "./scroll-reveal";

export function ProjectsContent({ projects }: { projects: Project[] }) {
  const { locale } = useLocale();

  return (
    <main className="section-band animate-fade-in animate-duration-300 animate-ease-out animate-fill-both">
      <div className="mx-auto w-full max-w-6xl px-5">
        <SectionHeading
          eyebrow={t(ui.projects.eyebrow, locale)}
          title={t(ui.projects.title, locale)}
          description={t(ui.projects.description, locale)}
        />
        <ScrollReveal delay={80}>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
