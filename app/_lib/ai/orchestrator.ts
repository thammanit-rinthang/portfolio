import { aiProviderPriority } from "../env";
import { GroqAdapter } from "./adapters/groq";
import { OpenRouterAdapter } from "./adapters/openrouter";
import { Message, ProviderAdapter } from "./types";

export class FallbackOrchestrator {
  private adapters: Record<string, ProviderAdapter>;
  private priority: string[];

  constructor(options?: { adapters?: Record<string, ProviderAdapter>; priority?: string[] }) {
    this.adapters = options?.adapters ?? {
      groq: new GroqAdapter(),
      openrouter: new OpenRouterAdapter(),
    };
    this.priority = options?.priority ?? aiProviderPriority;
  }

  async query(messages: Message[], systemPrompt?: string): Promise<{ answer: string; provider: string; model: string }> {
    const errors: Record<string, string> = {};

    for (const providerName of this.priority) {
      const adapter = this.adapters[providerName];
      if (!adapter) {
        continue;
      }

      if (!adapter.isEnabled) {
        console.info(`[ORCHESTRATOR] Skipping disabled provider: ${providerName}`);
        continue;
      }

      console.info(`[ORCHESTRATOR] Attempting query with provider: ${providerName}`);
      try {
        const result = await adapter.sendMessage(messages, systemPrompt);
        console.info(`[ORCHESTRATOR] Success using provider: ${providerName} | Model: ${result.model}`);
        return {
          answer: result.answer,
          provider: providerName,
          model: result.model,
        };
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error(`[ORCHESTRATOR] Error on provider: ${providerName} | Details: ${errorMsg}`);
        errors[providerName] = errorMsg;
      }
    }

    // If all providers failed or none were active
    console.error("[ORCHESTRATOR] All configured AI providers failed.", errors);
    throw new Error(
      `All configured AI providers failed. Diagnostics: ${JSON.stringify(errors)}`
    );
  }
}
