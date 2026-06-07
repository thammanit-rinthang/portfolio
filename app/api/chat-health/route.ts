import { NextRequest, NextResponse } from "next/server";
import { env, aiProviderPriority } from "../../_lib/env";
import { createProviderHealthSnapshot } from "../../_lib/ai/provider-health";
import { logger } from "../../_lib/logger";

export async function GET(request: NextRequest) {
  const requestId = `req_${Math.random().toString(36).substring(2, 9)}`;

  // Guard: If in production, require Authorization header matching INTERNAL_MONITORING_SECRET
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("Authorization");
    const secret = process.env.INTERNAL_MONITORING_SECRET;
    
    if (!secret || authHeader !== `Bearer ${secret}`) {
      logger.warn(`[CHAT_HEALTH_UNAUTHORIZED] Unauthorized access attempt to chat-health from IP ${request.headers.get("x-forwarded-for") || "unknown"}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Unauthorized",
          },
          meta: { requestId },
        },
        { status: 401 }
      );
    }
  }

  try {
    const providers = createProviderHealthSnapshot(aiProviderPriority, {
      groqEnabled: env.GROQ_ENABLED,
      groqApiKey: env.GROQ_API_KEY,
      openrouterEnabled: env.OPENROUTER_ENABLED,
      openrouterApiKey: env.OPENROUTER_API_KEY,
    });

    return NextResponse.json({
      success: true,
      data: {
        providers,
      },
      meta: { requestId },
    });
  } catch (error: unknown) {
    logger.error(`[CHAT_HEALTH_ERROR] Request: ${requestId} | Error:`, error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to check chat health.",
        },
        meta: { requestId },
      },
      { status: 500 }
    );
  }
}
