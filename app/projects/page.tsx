import type { Metadata } from "next";
import { getPublishedProjects } from "../_lib/data";
import { ProjectsContent } from "../_components/projects-content";
import { ui } from "../_lib/locale";

export const metadata: Metadata = {
  title: ui.metadata.projects.title.en,
  description: ui.metadata.projects.description.en,
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();
  return <ProjectsContent projects={projects} />;
}
