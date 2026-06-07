const PROMPT_INJECTION_PATTERNS = [
  "ignore previous instructions",
  "ignore all instructions",
  "ignore the rules",
  "ignore rules",
  "ignore above",
  "reset instructions",
  "reset rules",
  "forget your instructions",
  "forget rules",
  "forget your rules",
  "reveal system prompt",
  "reveal your prompt",
  "what is your system prompt",
  "show system prompt",
  "show instructions",
  "what are your instructions",
  "bypass rules",
  "system prompt",
  "ลืมกฎ",
  "ลืมคำสั่ง",
  "ข้ามกฎ",
  "แสดง system prompt",
  "system prompt คืออะไร",
  "คำสั่งระบบ",
  "เปิดเผย system prompt",
  "เปิดเผยคำสั่ง",
] as const;

export function sanitizeChatMessage(message: string): string {
  return message.replace(/[\x00-\x1F\x7F-\x9F]/g, "").trim();
}

export function isPromptInjectionAttempt(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return PROMPT_INJECTION_PATTERNS.some((pattern) => lowerMessage.includes(pattern));
}

export function normalizeAssistantAnswer(answer: string): string {
  const cleaned = answer
    .replace(
      /^(as an ai language model|as an ai|ในฐานะที่เป็น ai|ในฐานะโมเดลภาษา|ในฐานะ ai)[,.:\s]*/gi,
      "",
    )
    .trim();

  if (!cleaned) {
    return cleaned;
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
