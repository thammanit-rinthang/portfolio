import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env, aiProviderPriority } from "../../_lib/env";
import { prisma } from "../../_lib/prisma";
import {
  getOrCreateChatSession,
  getChatSessionMessages,
  saveChatMessage,
  verifyIpRateLimit,
} from "../../_lib/actions/chat";
import {
  isPromptInjectionAttempt,
  normalizeAssistantAnswer,
  sanitizeChatMessage,
} from "../../_lib/ai/chat-guards";
import { buildContextPrompt, detectReferences } from "../../_lib/ai/context-builder";
import { FallbackOrchestrator } from "../../_lib/ai/orchestrator";
import { Message, ModelContextProfile } from "../../_lib/ai/types";
import { logger } from "../../_lib/logger";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(env.CHAT_MAX_MESSAGE_LENGTH),
  sessionId: z.string().nullable().optional(),
  locale: z.enum(["th", "en"]).default("en"),
});

const orchestrator = new FallbackOrchestrator();

const MODEL_CONTEXT_PROFILES: Record<string, ModelContextProfile> = {
  groq: {
    provider: "groq",
    model: env.GROQ_MODEL || "llama-3.1-8b-instant",
    maxInputTokens: 5000,
    maxOutputTokens: 600,
    preferredSummaryTokens: 500,
  },
  openrouter: {
    provider: "openrouter",
    model: env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
    maxInputTokens: 7000,
    maxOutputTokens: 800,
    preferredSummaryTokens: 700,
  },
};

const DEFAULT_PROFILE: ModelContextProfile = {
  provider: "groq",
  model: "llama-3.1-8b-instant",
  maxInputTokens: 5000,
  maxOutputTokens: 600,
  preferredSummaryTokens: 500,
};

export async function POST(request: NextRequest) {
  const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;
  let locale: "en" | "th" = "en";

  try {
    const body = await request.json();
    const parseResult = chatRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parseResult.error.issues[0]?.message || "Invalid input parameters.",
          },
          meta: { requestId },
        },
        { status: 400 },
      );
    }

    const { message, sessionId } = parseResult.data;
    locale = parseResult.data.locale;

    const sanitizedMessage = sanitizeChatMessage(message);

    if (sanitizedMessage.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Message cannot be empty.",
          },
          meta: { requestId },
        },
        { status: 400 },
      );
    }

    if (isPromptInjectionAttempt(sanitizedMessage)) {
      logger.warn(`[CHAT_SECURITY_GUARD] Blocked potential prompt injection in request ${requestId}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PROMPT_INJECTION_DETECTED",
            message:
              locale === "th"
                ? "คำขอถูกปฏิเสธเนื่องจากนโยบายความปลอดภัย"
                : "Request declined due to security policies.",
          },
          meta: { requestId },
        },
        { status: 400 },
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const withinLimit = await verifyIpRateLimit(
      ip,
      env.CHAT_RATE_LIMIT_MAX,
      env.CHAT_RATE_LIMIT_WINDOW_MS,
    );

    if (!withinLimit) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMITED",
            message:
              locale === "th"
                ? "ส่งข้อความบ่อยเกินไป กรุณารอ 10 นาทีแล้วลองใหม่"
                : "Too many messages. Please try again in 10 minutes.",
          },
          meta: { requestId },
        },
        { status: 429 },
      );
    }

    const session = await getOrCreateChatSession(sessionId, locale);

    const historyLimit = session.summary ? 3 : 5;
    const dbMessages = await getChatSessionMessages(session.id, historyLimit);
    const chatHistory: Message[] = dbMessages.map((savedMessage) => ({
      role: savedMessage.role,
      content: savedMessage.content,
    }));

    const currentMessage: Message = { role: "user", content: sanitizedMessage };
    const messagesForAi = [...chatHistory, currentMessage];

    const primaryProvider = aiProviderPriority[0] || "groq";
    const profile = MODEL_CONTEXT_PROFILES[primaryProvider] || DEFAULT_PROFILE;
    const systemPrompt = await buildContextPrompt(
      sanitizedMessage,
      locale,
      profile,
      session.summary,
    );

    const aiResult = await orchestrator.query(messagesForAi, systemPrompt);
    const answer = normalizeAssistantAnswer(aiResult.answer);

    await Promise.all([
      saveChatMessage(session.id, "user", sanitizedMessage),
      saveChatMessage(session.id, "assistant", answer, aiResult.provider, aiResult.model),
    ]);

    const references = await detectReferences(answer);

    if (dbMessages.length >= 6) {
      void (async () => {
        try {
          const allMessages = await prisma.chatMessage.findMany({
            where: { sessionId: session.id },
            orderBy: { createdAt: "asc" },
          });
          const historyText = allMessages
            .map((savedMessage) => `${savedMessage.role === "user" ? "User" : "Assistant"}: ${savedMessage.content}`)
            .join("\n");

          const summaryPrompt = `You are a system assistant. Summarize the conversation history between the User and the Assistant.
Identify:
1. What technical topics, skills, or projects the user is interested in.
2. The user's preferred language.
3. Key context discussed.

Rules:
- Strictly summarize the conversation flow only.
- Do NOT invent or add any credentials, facts, or projects not mentioned in the text.
- Keep it under 100 words.
- Write the summary in English.

Conversation history:
${historyText}`;

          const summaryResult = await orchestrator.query(
            [{ role: "user", content: "Summarize our conversation so far." }],
            summaryPrompt,
          );

          await prisma.chatSession.update({
            where: { id: session.id },
            data: { summary: summaryResult.answer },
          });
          logger.info(`[CHAT_SUMMARY] Session ${session.id} summary updated successfully.`);
        } catch (summaryError) {
          logger.error("[CHAT_SUMMARY_ERROR] Failed to generate summary:", summaryError);
        }
      })();
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.sessionKey,
        answer,
        provider: aiResult.provider,
        model: aiResult.model,
        references,
      },
      meta: { requestId },
    });
  } catch (error: unknown) {
    logger.error(`[CHAT_API_ERROR] Request: ${requestId} | Error:`, error);

    const errorMessageText = error instanceof Error ? error.message : String(error);
    const isTimeout = errorMessageText.includes("timed out");
    const isRateLimit = errorMessageText.includes("rate limit");

    let status = 500;
    let errorCode = "INTERNAL_ERROR";
    let errorMessage =
      locale === "th"
        ? "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง"
        : "Something went wrong. Please try again.";

    if (isTimeout) {
      status = 504;
      errorCode = "PROVIDER_TIMEOUT";
    } else if (isRateLimit) {
      status = 429;
      errorCode = "PROVIDER_RATE_LIMITED";
    } else if (errorMessageText.includes("All configured AI providers failed")) {
      status = 503;
      errorCode = "ALL_PROVIDERS_FAILED";
      errorMessage =
        locale === "th"
          ? "ระบบแชตไม่สามารถให้บริการได้ในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง"
          : "Chat is temporarily unavailable. Please try again later.";
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
        meta: { requestId },
      },
      { status },
    );
  }
}
