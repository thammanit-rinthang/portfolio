import "server-only";

import { createSupabaseServiceClient } from "../supabase/server";

export type PublicProjectRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  problem: string | null;
  solution: string | null;
  role: string | null;
  stack: string[];
  deployment: string | null;
  impact: string | null;
  github_url: string | null;
  demo_url: string | null;
  is_featured: boolean;
  sort_order: number;
  project_tags: { tag: string }[];
  project_images: {
    image_url: string;
    alt: string;
    is_cover: boolean;
    sort_order: number;
  }[];
};

export async function getPublishedProjectsFromSupabase() {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      slug,
      title,
      summary,
      problem,
      solution,
      role,
      stack,
      deployment,
      impact,
      github_url,
      demo_url,
      is_featured,
      sort_order,
      project_tags(tag),
      project_images(image_url, alt, is_cover, sort_order)
    `,
    )
    .eq("is_published", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error("Unable to load published projects.");
  }

  return (data ?? []) as PublicProjectRecord[];
}

export async function getPublishedProjectBySlugFromSupabase(slug: string) {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      id,
      slug,
      title,
      summary,
      problem,
      solution,
      role,
      stack,
      deployment,
      impact,
      github_url,
      demo_url,
      is_featured,
      sort_order,
      project_tags(tag),
      project_images(image_url, alt, is_cover, sort_order)
    `,
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error("Unable to load the requested project.");
  }

  return data as PublicProjectRecord;
}

