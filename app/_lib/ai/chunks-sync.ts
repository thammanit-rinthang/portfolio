import { prisma } from "../prisma";
import { SourceType } from "../prisma";

export async function deleteChunkForResource(sourceType: SourceType, sourceId: string) {
  await prisma.portfolioChunk.deleteMany({
    where: {
      sourceType,
      sourceId,
    },
  });
}

export async function syncChunkForProfile(profileId: string) {
  // First, delete existing chunks for this profile
  await deleteChunkForResource("profile", profileId);

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  });

  if (!profile || !profile.isPublished) {
    return;
  }

  // Create English chunk
  const content = `Name: ${profile.name}
Headline: ${profile.headline}
Summary: ${profile.summary}
Location: ${profile.location || ""}
Email: ${profile.email || ""}
Phone: ${profile.phone || ""}
GitHub: ${profile.githubUrl || ""}
LinkedIn: ${profile.linkedinUrl || ""}
Resume URL: ${profile.resumeUrl || ""}`;

  await prisma.portfolioChunk.create({
    data: {
      sourceType: "profile",
      sourceId: profile.id,
      locale: "en",
      title: `Profile: ${profile.name}`,
      content,
      tags: ["profile", "about", "contact", "developer", "email", "github", "linkedin", "resume"],
      priority: 100,
      isPublic: true,
    },
  });
}

export async function syncChunkForExperience(experienceId: string) {
  await deleteChunkForResource("experience", experienceId);

  const exp = await prisma.experience.findUnique({
    where: { id: experienceId },
  });

  if (!exp || !exp.isPublished || exp.deletedAt) {
    return;
  }

  const highlights = (exp.highlights as string[]) || [];
  const content = `Company: ${exp.company}
Role: ${exp.role}
Period: ${exp.periodLabel || ""}
Summary: ${exp.summary || ""}
Highlights:
${highlights.map((h) => `- ${h}`).join("\n")}`;

  const tags = ["experience", "work", "job", exp.company.toLowerCase(), exp.role.toLowerCase()];

  await prisma.portfolioChunk.create({
    data: {
      sourceType: "experience",
      sourceId: exp.id,
      locale: "en",
      title: `Experience: ${exp.role} at ${exp.company}`,
      content,
      tags,
      priority: 80 - exp.sortOrder,
      isPublic: true,
    },
  });
}

export async function syncChunkForProject(projectId: string) {
  await deleteChunkForResource("project", projectId);

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { tags: true },
  });

  if (!project || !project.isPublished || project.deletedAt) {
    return;
  }

  const tagsList = project.tags.map((t) => t.tag);
  const stackList = (project.stack as string[]) || [];

  const content = `Project: ${project.title}
Slug: ${project.slug}
Summary: ${project.summary}
Problem: ${project.problem || ""}
Solution: ${project.solution || ""}
Role: ${project.role || ""}
Stack: ${stackList.join(", ")}
Deployment: ${project.deployment || ""}
Impact: ${project.impact || ""}`;

  const tags = [
    "project",
    project.slug,
    project.title.toLowerCase(),
    ...tagsList.map((t) => t.toLowerCase()),
    ...stackList.map((s) => s.toLowerCase()),
  ];

  await prisma.portfolioChunk.create({
    data: {
      sourceType: "project",
      sourceId: project.id,
      locale: "en",
      title: `Project: ${project.title}`,
      content,
      tags,
      priority: project.isFeatured ? 90 : 70,
      isPublic: true,
    },
  });
}

export async function syncChunkForSkills() {
  // Group and synchronize all skill chunks
  await prisma.portfolioChunk.deleteMany({
    where: { sourceType: "skill" },
  });

  const skills = await prisma.skill.findMany({
    where: { isPublished: true, deletedAt: null },
    orderBy: { priority: "asc" },
  });

  if (skills.length === 0) return;

  const categories: Record<string, typeof skills> = {};
  skills.forEach((skill) => {
    if (!categories[skill.category]) {
      categories[skill.category] = [];
    }
    categories[skill.category].push(skill);
  });

  for (const [category, categorySkills] of Object.entries(categories)) {
    const skillNames = categorySkills.map((s) => s.name);
    const content = `Category: ${category}\nSkills: ${skillNames.join(" / ")}`;
    const tags = [
      "skills",
      "capabilities",
      category.toLowerCase(),
      ...skillNames.map((s) => s.toLowerCase()),
    ];

    await prisma.portfolioChunk.create({
      data: {
        sourceType: "skill",
        sourceId: categorySkills[0]?.id,
        locale: "en",
        title: `Skills: ${category}`,
        content,
        tags,
        priority: 95,
        isPublic: true,
      },
    });
  }
}

export async function recreateAllPortfolioChunks() {
  console.info("Recreating all portfolio chunks...");
  
  // Clean up all chunks
  await prisma.portfolioChunk.deleteMany({});

  // 1. Sync Profile
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "desc" },
  });
  if (profile) {
    await syncChunkForProfile(profile.id);
  }

  // 2. Sync Experiences
  const experiences = await prisma.experience.findMany({
    where: { deletedAt: null },
  });
  for (const exp of experiences) {
    await syncChunkForExperience(exp.id);
  }

  // 3. Sync Projects
  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
  });
  for (const proj of projects) {
    await syncChunkForProject(proj.id);
  }

  // 4. Sync Skills
  await syncChunkForSkills();

  console.info("Portfolio chunks recreation completed.");
}
