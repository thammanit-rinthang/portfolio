"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "../prisma";
import { verifyAdminSession } from "../auth";
import { verifyRateLimit } from "../rate-limit";
import { logger } from "../logger";
import {
  syncChunkForProfile,
  syncChunkForProject,
  syncChunkForSkills,
  syncChunkForExperience,
  deleteChunkForResource,
} from "../ai/chunks-sync";

// --- Rate Limit Helper ---
async function checkAdminRateLimit() {
  const clientHeaders = await headers();
  const ip = clientHeaders.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  // Enforce limit of 60 database mutations per minute per IP
  const withinLimit = await verifyRateLimit(ip, "admin_mutation", 60, 60000);
  if (!withinLimit) {
    throw new Error("Rate limit exceeded. Too many requests, please try again in a minute.");
  }
}

// --- UUID Checker ---
function validateUuid(id: string, name = "ID") {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!id || !uuidRegex.test(id)) {
    throw new Error(`Invalid ${name} format.`);
  }
}

// --- Validation Schemas ---
const profileSchema = z.object({
  id: z.string().uuid("Invalid Profile ID format"),
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  headline: z.string().min(1, "Headline is required").max(200, "Headline cannot exceed 200 characters"),
  summary: z.string().min(1, "Summary is required").max(2000, "Summary cannot exceed 2000 characters"),
  location: z.string().max(100, "Location cannot exceed 100 characters").optional().nullable(),
  email: z.string().email("Invalid email format").max(150, "Email cannot exceed 150 characters").optional().nullable().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").max(300, "URL cannot exceed 300 characters").optional().nullable().or(z.literal("")),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").max(300, "URL cannot exceed 300 characters").optional().nullable().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

const projectSchema = z.object({
  id: z.string().uuid("Invalid Project ID format").optional().nullable().or(z.literal("")),
  slug: z.string().min(1, "Slug is required").max(100, "Slug cannot exceed 100 characters").regex(/^[a-z0-9_-]+$/, "Slug must be lowercase alphanumeric and dashes/underscores only"),
  title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
  summary: z.string().min(1, "Summary is required").max(1000, "Summary cannot exceed 1000 characters"),
  problem: z.string().max(2000, "Problem description cannot exceed 2000 characters").optional().nullable(),
  solution: z.string().max(2000, "Solution description cannot exceed 2000 characters").optional().nullable(),
  role: z.string().max(100, "Role cannot exceed 100 characters").optional().nullable(),
  stack: z.array(z.string().max(50)).max(50, "Stack list cannot exceed 50 items").default([]),
  tags: z.array(z.string().max(50)).max(50, "Tag list cannot exceed 50 items").default([]),
  deployment: z.string().max(200, "Deployment info cannot exceed 200 characters").optional().nullable(),
  impact: z.string().max(2000, "Impact description cannot exceed 2000 characters").optional().nullable(),
  githubUrl: z.string().url("Invalid GitHub URL").max(300, "URL cannot exceed 300 characters").optional().nullable().or(z.literal("")),
  demoUrl: z.string().url("Invalid Demo URL").max(300, "URL cannot exceed 300 characters").optional().nullable().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().int().nonnegative().default(0),
});

const skillSchema = z.object({
  id: z.string().uuid("Invalid Skill ID format").optional().nullable().or(z.literal("")),
  name: z.string().min(1, "Name is required").max(100, "Name cannot exceed 100 characters"),
  category: z.string().min(1, "Category is required").max(100, "Category cannot exceed 100 characters"),
  priority: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

const experienceSchema = z.object({
  id: z.string().uuid("Invalid Experience ID format").optional().nullable().or(z.literal("")),
  company: z.string().min(1, "Company is required").max(100, "Company name cannot exceed 100 characters"),
  role: z.string().min(1, "Role is required").max(100, "Role name cannot exceed 100 characters"),
  periodLabel: z.string().max(100, "Period label cannot exceed 100 characters").optional().nullable(),
  highlights: z.array(z.string().max(500)).max(20, "Highlights cannot exceed 20 points").default([]),
  sortOrder: z.number().int().default(0),
  isPublished: z.boolean().default(false),
});

// --- Server Actions ---

export async function updateProfileAction(formData: FormData) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();

    const id = formData.get("id")?.toString();
    if (!id) return { error: "Profile ID is required" };

    const data = {
      name: formData.get("name")?.toString() || "",
      headline: formData.get("headline")?.toString() || "",
      summary: formData.get("summary")?.toString() || "",
      location: formData.get("location")?.toString(),
      email: formData.get("email")?.toString(),
      githubUrl: formData.get("githubUrl")?.toString(),
      linkedinUrl: formData.get("linkedinUrl")?.toString(),
      isPublished: formData.get("isPublished") === "on",
    };

    const parseResult = profileSchema.safeParse({ id, ...data });
    if (!parseResult.success) {
      return { error: `Validation error: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
    }

    const validatedData = parseResult.data;

    await prisma.profile.update({
      where: { id: validatedData.id },
      data: {
        name: validatedData.name,
        headline: validatedData.headline,
        summary: validatedData.summary,
        location: validatedData.location,
        email: validatedData.email,
        githubUrl: validatedData.githubUrl,
        linkedinUrl: validatedData.linkedinUrl,
        isPublished: validatedData.isPublished,
      },
    });

    logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPDATE_PROFILE | Resource: profile:${id} | Details: Updated global profile`);
    await syncChunkForProfile(id);
    
    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/contact");
    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to update profile.";
    logger.error("Update profile action error:", error);
    return { error: errMsg };
  }
}

export async function upsertProjectAction(formData: FormData) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();

    const id = formData.get("id")?.toString();
    const slug = formData.get("slug")?.toString();
    if (!slug) return { error: "Slug is required" };

    const stack = formData.get("stack")?.toString().split(",").map(s => s.trim()).filter(Boolean) || [];
    const tags = formData.get("tags")?.toString().split(",").map(s => s.trim()).filter(Boolean) || [];

    const data = {
      slug,
      title: formData.get("title")?.toString() || "",
      summary: formData.get("summary")?.toString() || "",
      problem: formData.get("problem")?.toString(),
      solution: formData.get("solution")?.toString(),
      role: formData.get("role")?.toString(),
      stack,
      tags,
      deployment: formData.get("deployment")?.toString(),
      impact: formData.get("impact")?.toString(),
      githubUrl: formData.get("githubUrl")?.toString(),
      demoUrl: formData.get("demoUrl")?.toString(),
      isFeatured: formData.get("isFeatured") === "on",
      isPublished: formData.get("isPublished") === "on",
      sortOrder: parseInt(formData.get("sortOrder")?.toString() || "0"),
    };

    const parseResult = projectSchema.safeParse({ id, ...data });
    if (!parseResult.success) {
      return { error: `Validation error: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
    }

    const validated = parseResult.data;

    let projectId = validated.id || undefined;
    const dbData = {
      slug: validated.slug,
      title: validated.title,
      summary: validated.summary,
      problem: validated.problem,
      solution: validated.solution,
      role: validated.role,
      stack: validated.stack,
      deployment: validated.deployment,
      impact: validated.impact,
      githubUrl: validated.githubUrl || null,
      demoUrl: validated.demoUrl || null,
      isFeatured: validated.isFeatured,
      isPublished: validated.isPublished,
      sortOrder: validated.sortOrder,
    };

    if (projectId) {
      await prisma.project.update({
        where: { id: projectId },
        data: dbData,
      });
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPDATE_PROJECT | Resource: project:${projectId} | Details: Updated project ${dbData.title}`);
    } else {
      const created = await prisma.project.create({
        data: dbData,
      });
      projectId = created.id;
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: CREATE_PROJECT | Resource: project:${projectId} | Details: Created project ${dbData.title}`);
    }

    if (projectId) {
      // Sync tags
      await prisma.projectTag.deleteMany({ where: { projectId } });
      if (validated.tags.length > 0) {
        await prisma.projectTag.createMany({
          data: validated.tags.map(tag => ({ projectId: projectId!, tag })),
          skipDuplicates: true,
        });
      }
      await syncChunkForProject(projectId);
    }

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${validated.slug}`);
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to save project.";
    logger.error("Save project action error:", error);
    return { error: errMsg };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();
    validateUuid(id, "Project ID");

    // Soft delete
    const updated = await prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    logger.info(`[AUDIT_LOG] User: ${user.email} | Action: SOFT_DELETE_PROJECT | Resource: project:${id} | Details: Soft-deleted project ${updated.title}`);
    await deleteChunkForResource("project", id);
    
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to delete project.";
    logger.error("Delete project action error:", error);
    return { error: errMsg };
  }
}

export async function upsertSkillAction(formData: FormData) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const priority = parseInt(formData.get("priority")?.toString() || "0");
    const isPublished = formData.get("isPublished") === "on";

    const parseResult = skillSchema.safeParse({ id, name, category, priority, isPublished });
    if (!parseResult.success) {
      return { error: `Validation error: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
    }

    const validated = parseResult.data;
    const dbData = {
      name: validated.name,
      category: validated.category,
      priority: validated.priority,
      isPublished: validated.isPublished,
    };

    if (validated.id) {
      await prisma.skill.update({
        where: { id: validated.id },
        data: dbData,
      });
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPDATE_SKILL | Resource: skill:${validated.id} | Details: Updated skill ${validated.name} in category ${validated.category}`);
    } else {
      const created = await prisma.skill.create({
        data: dbData,
      });
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: CREATE_SKILL | Resource: skill:${created.id} | Details: Created skill ${validated.name} in category ${validated.category}`);
    }
    await syncChunkForSkills();

    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to save skill.";
    logger.error("Save skill action error:", error);
    return { error: errMsg };
  }
}

export async function deleteSkillAction(id: string) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();
    validateUuid(id, "Skill ID");

    const deleted = await prisma.skill.delete({ where: { id } });
    logger.info(`[AUDIT_LOG] User: ${user.email} | Action: DELETE_SKILL | Resource: skill:${id} | Details: Deleted skill ${deleted.name}`);
    await syncChunkForSkills();

    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/skills");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to delete skill.";
    logger.error("Delete skill action error:", error);
    return { error: errMsg };
  }
}

export async function upsertExperienceAction(formData: FormData) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();

    const id = formData.get("id")?.toString();
    const company = formData.get("company")?.toString() || "";
    const role = formData.get("role")?.toString() || "";
    const periodLabel = formData.get("periodLabel")?.toString() || formData.get("period")?.toString() || "";
    const highlights = formData.get("highlights")?.toString().split("\n").map(s => s.trim()).filter(Boolean) || [];
    const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0");
    const isPublished = formData.get("isPublished") === "on";

    const parseResult = experienceSchema.safeParse({ id, company, role, periodLabel, highlights, sortOrder, isPublished });
    if (!parseResult.success) {
      return { error: `Validation error: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
    }

    const validated = parseResult.data;
    const dbData = {
      company: validated.company,
      role: validated.role,
      periodLabel: validated.periodLabel || "",
      highlights: validated.highlights,
      sortOrder: validated.sortOrder,
      isPublished: validated.isPublished,
    };

    let expId = validated.id || undefined;
    if (expId) {
      await prisma.experience.update({
        where: { id: expId },
        data: dbData,
      });
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: UPDATE_EXPERIENCE | Resource: experience:${expId} | Details: Updated experience ${validated.role} at ${validated.company}`);
    } else {
      const created = await prisma.experience.create({
        data: dbData,
      });
      expId = created.id;
      logger.info(`[AUDIT_LOG] User: ${user.email} | Action: CREATE_EXPERIENCE | Resource: experience:${created.id} | Details: Created experience ${validated.role} at ${validated.company}`);
    }
    if (expId) {
      await syncChunkForExperience(expId);
    }

    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to save experience.";
    logger.error("Save experience action error:", error);
    return { error: errMsg };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();
    validateUuid(id, "Experience ID");

    const deleted = await prisma.experience.delete({ where: { id } });
    logger.info(`[AUDIT_LOG] User: ${user.email} | Action: DELETE_EXPERIENCE | Resource: experience:${id} | Details: Deleted experience ${deleted.role} at ${deleted.company}`);
    await deleteChunkForResource("experience", id);

    revalidatePath("/");
    revalidatePath("/resume");
    revalidatePath("/admin/experience");
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to delete experience.";
    logger.error("Delete experience action error:", error);
    return { error: errMsg };
  }
}

export async function deleteProjectImageAction(id: string) {
  try {
    const user = await verifyAdminSession();
    await checkAdminRateLimit();
    validateUuid(id, "Project Image ID");

    const img = await prisma.projectImage.findUnique({ where: { id } });
    if (!img) {
      return { error: "Image not found" };
    }

    const { createSupabaseServiceClient } = await import("../supabase/server");
    const supabase = createSupabaseServiceClient();

    if (img.imagePath) {
      const { error: storageError } = await supabase.storage
        .from("project-images")
        .remove([img.imagePath]);
      if (storageError) {
        logger.error("Failed to delete file from storage:", storageError);
      }
    }

    await prisma.projectImage.delete({ where: { id } });
    logger.info(`[AUDIT_LOG] User: ${user.email} | Action: DELETE_PROJECT_IMAGE | Resource: project_image:${id} | Details: Deleted image path ${img.imagePath} for project ${img.projectId}`);

    revalidatePath("/admin/media");
    revalidatePath(`/projects`);
    return { success: true };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Failed to delete project image.";
    logger.error("Delete project image action error:", error);
    return { error: errMsg };
  }
}

