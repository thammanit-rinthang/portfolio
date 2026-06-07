import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/_lib/env", () => ({
  aiProviderPriority: ["groq", "openrouter"],
}));

import { FallbackOrchestrator } from "@/app/_lib/ai/orchestrator";
import type { Message, ProviderAdapter } from "@/app/_lib/ai/types";

function createAdapter(
  name: ProviderAdapter["name"],
  options: {
    isEnabled?: boolean;
    sendMessage?: ProviderAdapter["sendMessage"];
  } = {},
): ProviderAdapter {
  return {
    name,
    isEnabled: options.isEnabled ?? true,
    sendMessage:
      options.sendMessage ??
      vi.fn(async () => ({
        answer: "ok",
        model: `${name}-model`,
      })),
  };
}

describe("FallbackOrchestrator", () => {
  const messages: Message[] = [{ role: "user", content: "hello" }];

  it("falls back to the next enabled provider when the first one fails", async () => {
    const orchestrator = new FallbackOrchestrator({
      priority: ["groq", "openrouter"],
      adapters: {
        groq: createAdapter("groq", {
          sendMessage: vi.fn(async () => {
            throw new Error("groq unavailable");
          }),
        }),
        openrouter: createAdapter("openrouter", {
          sendMessage: vi.fn(async () => ({
            answer: "from openrouter",
            model: "openrouter-model",
          })),
        }),
      },
    });

    await expect(orchestrator.query(messages, "context")).resolves.toEqual({
      answer: "from openrouter",
      provider: "openrouter",
      model: "openrouter-model",
    });
  });

  it("throws a combined error when all configured providers fail", async () => {
    const orchestrator = new FallbackOrchestrator({
      priority: ["groq", "openrouter"],
      adapters: {
        groq: createAdapter("groq", {
          sendMessage: vi.fn(async () => {
            throw new Error("timeout");
          }),
        }),
        openrouter: createAdapter("openrouter", {
          sendMessage: vi.fn(async () => {
            throw new Error("rate limit");
          }),
        }),
      },
    });

    await expect(orchestrator.query(messages)).rejects.toThrow("All configured AI providers failed");
  });
});
