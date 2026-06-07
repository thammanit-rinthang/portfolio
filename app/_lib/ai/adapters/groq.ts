import { env } from "../../env";
import { Message, ProviderAdapter } from "../types";

export class GroqAdapter implements ProviderAdapter {
  name = "groq" as const;
  isEnabled = env.GROQ_ENABLED && !!env.GROQ_API_KEY;

  async sendMessage(messages: Message[], systemPrompt?: string): Promise<{ answer: string; model: string }> {
    if (!env.GROQ_API_KEY) {
      throw new Error("Groq API key is not configured.");
    }

    const model = env.GROQ_MODEL;
    const url = "https://api.groq.com/openai/v1/chat/completions";

    const formattedMessages = [];
    if (systemPrompt) {
      formattedMessages.push({ role: "system", content: systemPrompt });
    }
    formattedMessages.push(...messages.map(m => ({ role: m.role.toLowerCase(), content: m.content })));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.CHAT_PROVIDER_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.1,
          max_completion_tokens: 1024,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error("Groq API rate limit exceeded.");
      }

      if (!response.ok) {
        throw new Error(`Groq responded with status: ${response.status}`);
      }

      const data = await response.json();
      const answer = data?.choices?.[0]?.message?.content;

      if (!answer) {
        throw new Error("Groq returned an empty response.");
      }

      return { answer, model };
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`Groq request timed out after ${env.CHAT_PROVIDER_TIMEOUT_MS}ms`);
      }
      throw error;
    }
  }
}
