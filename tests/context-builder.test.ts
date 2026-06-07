import { describe, expect, it, vi } from "vitest";

const { findMany } = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/app/_lib/prisma", () => ({
  prisma: {
    portfolioChunk: {
      findMany,
    },
  },
}));

vi.mock("@/app/_lib/data", () => ({
  getPublishedProjects: vi.fn(async () => []),
}));

import { buildContextPrompt } from "@/app/_lib/ai/context-builder";
import type { ModelContextProfile } from "@/app/_lib/ai/types";

const profile: ModelContextProfile = {
  provider: "groq",
  model: "test-model",
  maxInputTokens: 5000,
  maxOutputTokens: 600,
  preferredSummaryTokens: 500,
};

describe("buildContextPrompt", () => {
  it("instructs the assistant to answer as Thammanit in first person in English", async () => {
    findMany.mockResolvedValue([
      {
        sourceType: "profile",
        title: "Profile",
        content: "Thammanit builds internal systems with Next.js and PostgreSQL.",
        tags: ["profile", "nextjs"],
        priority: 10,
      },
    ]);

    const prompt = await buildContextPrompt("What do you build with Next.js?", "en", profile);

    expect(prompt).toContain("Speak as Thammanit in the first person");
    expect(prompt).toContain('Use "I", "my", and "me" naturally');
    expect(prompt).toContain("I can only answer questions about my portfolio.");
    expect(prompt).not.toContain("Refer to Thammanit in the third person");
  });

  it("instructs the assistant to answer as Thammanit in first person in Thai", async () => {
    findMany.mockResolvedValue([
      {
        sourceType: "profile",
        title: "Profile",
        content: "ธรรมนิตย์ทำระบบภายในด้วย Next.js และ PostgreSQL",
        tags: ["profile", "nextjs"],
        priority: 10,
      },
    ]);

    const prompt = await buildContextPrompt("คุณทำอะไรด้วย Next.js", "th", profile);

    expect(prompt).toContain("ให้ตอบเหมือนธรรมนิตย์เป็นคนตอบเอง");
    expect(prompt).toContain('ใช้ "ผม", "ของผม", และ "ผมทำ"');
    expect(prompt).toContain("ผมตอบได้เฉพาะเรื่อง portfolio ของผมครับ");
    expect(prompt).not.toContain("บุรุษที่สาม");
  });
});
