import { NextResponse } from "next/server";
import { buildContextPrompt } from "../../_lib/ai/context-builder";
import { ModelContextProfile } from "../../_lib/ai/types";

const TEST_PROFILE: ModelContextProfile = {
  provider: "groq",
  model: "llama-3.1-8b-instant",
  maxInputTokens: 5000,
  maxOutputTokens: 600,
  preferredSummaryTokens: 500,
};

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Forbidden in production" }, { status: 403 });
  }

  try {
    const results: Record<string, string> = {};

    // Test 1: Query Docker
    results.dockerQuery = await buildContextPrompt(
      "What is his experience with Docker?",
      "en",
      TEST_PROFILE
    );

    // Test 2: Query QMS System
    results.qmsQuery = await buildContextPrompt(
      "Tell me about the QMS System.",
      "en",
      TEST_PROFILE
    );

    // Test 3: Query Hello (should fallback to profile)
    results.fallbackQuery = await buildContextPrompt(
      "Hello, how are you?",
      "en",
      TEST_PROFILE
    );

    return NextResponse.json({
      success: true,
      tests: results,
    });
  } catch (error: unknown) {
    console.error("[TEST-RETRIEVAL] Error running tests:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
