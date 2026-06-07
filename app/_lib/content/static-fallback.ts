import { getProject, projects } from "../../_data/portfolio";

export function getStaticProjects() {
  return projects;
}

export function getStaticProjectBySlug(slug: string) {
  return getProject(slug);
}

