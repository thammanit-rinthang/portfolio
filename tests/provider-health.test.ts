import { describe, expect, it } from "vitest";
import { createProviderHealthSnapshot } from "@/app/_lib/ai/provider-health";

describe("provider health snapshot", () => {
  it("maps provider availability based on enable flags and credentials", () => {
    expect(
      createProviderHealthSnapshot(["groq", "openrouter"], {
        groqEnabled: true,
        groqApiKey: "",
        openrouterEnabled: true,
        openrouterApiKey: "openrouter-key",
      }),
    ).toEqual([
      { name: "groq", available: false, priority: 1 },
      { name: "openrouter", available: true, priority: 2 },
    ]);
  });
});
