import { ChatRole } from "../../generated/prisma/client";

export interface Message {
  role: ChatRole;
  content: string;
}

export interface Reference {
  type: "project" | "resume" | "experience" | "skill";
  title: string;
  href: string;
}

export interface ChatResponse {
  answer: string;
  provider: string;
  model: string;
  references: Reference[];
}

export interface ProviderAdapter {
  name: "groq" | "openrouter";
  isEnabled: boolean;
  sendMessage(messages: Message[], context?: string): Promise<{ answer: string; model: string }>;
}

export interface ModelContextProfile {
  provider: "groq" | "openrouter";
  model: string;
  maxInputTokens: number;
  maxOutputTokens: number;
  preferredSummaryTokens: number;
}
