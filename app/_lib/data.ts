import { prisma } from "./prisma";
import {
  profile as staticProfile,
  skills as staticSkills,
  experiences as staticExperiences,
  projects as staticProjects,
  getFeaturedProjects as staticGetFeaturedProjects,
  getProject as staticGetProjectBySlug,
} from "../_data/portfolio";

export async function getPublishedProfile() {
  try {
    const profile = await prisma.profile.findFirst({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    if (profile) {
      return {
        name: profile.name,
        headline: profile.headline,
        location: profile.location || "",
        phone: profile.phone || "",
        email: profile.email || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        jobdbUrl: profile.jobdbUrl || "",
        avatarUrl: profile.avatarUrl || "",
        avatarPath: profile.avatarPath || "",
        avatarAlt: profile.avatarAlt || "Portrait of Thammanit Rinthang",
        resumeUrl: profile.resumeUrl || "",
        summary: profile.summary,
        proof: staticProfile.proof, // Kept static since the db schema didn't map proof
      };
    }
  } catch (error) {
    console.error("Failed to fetch profile from Supabase, falling back to static data", error);
  }
  return staticProfile;
}

export async function getPublishedSkills() {
  try {
    const dbSkills = await prisma.skill.findMany({
      where: { isPublished: true },
      orderBy: [{ priority: "asc" }],
    });

    if (dbSkills.length > 0) {
      const grouped = dbSkills.reduce((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill.name);
        return acc;
      }, {} as Record<string, string[]>);

      return Object.entries(grouped).map(([group, items]) => ({
        group,
        items,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch skills from Supabase, falling back to static data", error);
  }
  return staticSkills;
}

export async function getPublishedExperiences() {
  try {
    const exps = await prisma.experience.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
    });
    if (exps.length > 0) {
      return exps.map((e) => ({
        company: e.company,
        role: e.role,
        period: e.periodLabel || "",
        highlights: (e.highlights as string[]) || [],
      }));
    }
  } catch (error) {
    console.error("Failed to fetch experiences from Supabase, falling back to static data", error);
  }
  return staticExperiences;
}

export async function getPublishedProjects(featuredOnly = false) {
  try {
    const dbProjects = await prisma.project.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        ...(featuredOnly ? { isFeatured: true } : {}),
      },
      orderBy: { sortOrder: "asc" },
      include: {
        tags: true,
        images: {
          where: { isPublished: true, deletedAt: null },
          orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    if (dbProjects.length > 0) {
      return dbProjects.map((p) => ({
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        problem: p.problem || "",
        solution: p.solution || "",
        role: p.role || "",
        stack: (p.stack as string[]) || [],
        tags: p.tags.map((t) => t.tag),
        deployment: p.deployment || "",
        impact: p.impact || "",
        githubUrl: p.githubUrl || undefined,
        featured: p.isFeatured,
        images: p.images.map((image) => ({
          url: image.imageUrl,
          alt: image.alt,
          isCover: image.isCover,
        })),
      }));
    }
  } catch (error) {
    console.error("Failed to fetch projects from Supabase, falling back to static data", error);
  }
  return featuredOnly ? staticGetFeaturedProjects() : staticProjects;
}

export async function getPublishedProjectBySlug(slug: string) {
  try {
    const p = await prisma.project.findFirst({
      where: { slug, isPublished: true, deletedAt: null },
      include: {
        tags: true,
        images: {
          where: { isPublished: true, deletedAt: null },
          orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });
    if (p) {
      return {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        problem: p.problem || "",
        solution: p.solution || "",
        role: p.role || "",
        stack: (p.stack as string[]) || [],
        tags: p.tags.map((t) => t.tag),
        deployment: p.deployment || "",
        impact: p.impact || "",
        githubUrl: p.githubUrl || undefined,
        featured: p.isFeatured,
        images: p.images.map((image) => ({
          url: image.imageUrl,
          alt: image.alt,
          isCover: image.isCover,
        })),
      };
    }
  } catch (error) {
    console.error(`Failed to fetch project ${slug} from Supabase, falling back to static data`, error);
  }
  return staticGetProjectBySlug(slug);
}
