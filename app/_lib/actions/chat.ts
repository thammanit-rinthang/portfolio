import { prisma } from "../prisma";
import { ChatRole } from "../../generated/prisma/client";
import { verifyRateLimit } from "../rate-limit";

export async function getOrCreateChatSession(sessionKey?: string | null, locale = "en") {
  if (sessionKey) {
    try {
      const session = await prisma.chatSession.findUnique({
        where: { sessionKey },
      });
      if (session) {
        return session;
      }
    } catch (error) {
      console.error(`Error loading session ${sessionKey}:`, error);
    }
  }

  // Generate a random 16-character alphanumeric key if not provided
  const generatedKey = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);

  return prisma.chatSession.create({
    data: {
      sessionKey: generatedKey,
      locale,
    },
  });
}

export async function getChatSessionMessages(sessionId: string, limit = 8) {
  try {
    return await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: limit * 2, // Load up to limit turns (user + assistant)
    });
  } catch (error) {
    console.error(`Error loading messages for session ${sessionId}:`, error);
    return [];
  }
}

export async function saveChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string,
  provider?: string,
  model?: string
) {
  const tokenEstimate = Math.ceil(content.length / 4);

  return prisma.chatMessage.create({
    data: {
      sessionId,
      role: role as ChatRole,
      content,
      provider,
      model,
      tokenEstimate,
    },
  });
}

export async function verifyIpRateLimit(
  ipAddress: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  return verifyRateLimit(ipAddress, "chat", maxRequests, windowMs);
}


