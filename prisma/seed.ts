import {
  seededExperiences,
  seededProfile,
  seededProjects,
  seededSkills,
} from "./seed-data";
import { createSeedPrismaClient } from "./prisma-client";
import { recreateAllPortfolioChunks } from "../app/_lib/ai/chunks-sync";

const prisma = createSeedPrismaClient();

async function upsertProfile() {
  const existingProfile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  const data = {
    ...seededProfile,
    isPublished: true,
    publishedAt: new Date(),
  };

  if (existingProfile) {
    return prisma.profile.update({
      where: { id: existingProfile.id },
      data,
    });
  }

  return prisma.profile.create({ data });
}

async function upsertSkills() {
  for (const skill of seededSkills) {
    const existingSkill = await prisma.skill.findFirst({
      where: {
        name: skill.name,
        category: skill.category,
      },
    });

    const data = {
      name: skill.name,
      category: skill.category,
      priority: skill.priority,
      isPublished: true,
      publishedAt: new Date(),
      deletedAt: null,
    };

    if (existingSkill) {
      await prisma.skill.update({
        where: { id: existingSkill.id },
        data,
      });
    } else {
      await prisma.skill.create({ data });
    }
  }
}

async function upsertExperiences() {
  for (const experience of seededExperiences) {
    const existingExperience = await prisma.experience.findFirst({
      where: {
        company: experience.company,
        role: experience.role,
        periodLabel: experience.periodLabel,
      },
    });

    const data = {
      company: experience.company,
      role: experience.role,
      periodLabel: experience.periodLabel,
      summary: experience.summary,
      highlights: experience.highlights,
      sortOrder: experience.sortOrder,
      isPublished: true,
      publishedAt: new Date(),
      deletedAt: null,
    };

    if (existingExperience) {
      await prisma.experience.update({
        where: { id: existingExperience.id },
        data,
      });
    } else {
      await prisma.experience.create({ data });
    }
  }
}

async function upsertProjects() {
  for (const project of seededProjects) {
    const savedProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: project.title,
        summary: project.summary,
        problem: project.problem,
        solution: project.solution,
        role: project.role,
        stack: project.stack,
        deployment: project.deployment,
        impact: project.impact,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        isFeatured: project.isFeatured,
        isPublished: true,
        publishedAt: new Date(),
        sortOrder: project.sortOrder,
        deletedAt: null,
      },
      create: {
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        problem: project.problem,
        solution: project.solution,
        role: project.role,
        stack: project.stack,
        deployment: project.deployment,
        impact: project.impact,
        githubUrl: project.githubUrl,
        demoUrl: project.demoUrl,
        isFeatured: project.isFeatured,
        isPublished: true,
        publishedAt: new Date(),
        sortOrder: project.sortOrder,
      },
    });

    await prisma.projectTag.deleteMany({
      where: { projectId: savedProject.id },
    });

    if (project.tags.length > 0) {
      await prisma.projectTag.createMany({
        data: project.tags.map((tag) => ({
          projectId: savedProject.id,
          tag,
        })),
      });
    }
  }
}

async function main() {
  console.log("Starting resume-based seed...");

  console.log("Seeding profile...");
  await upsertProfile();

  console.log("Seeding skills...");
  await upsertSkills();

  console.log("Seeding experiences...");
  await upsertExperiences();

  console.log("Seeding projects...");
  await upsertProjects();

  console.log("Generating portfolio chunks...");
  await recreateAllPortfolioChunks();

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

