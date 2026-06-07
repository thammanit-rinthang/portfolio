import "server-only";

import { z } from "zod";

const booleanFromEnv = (defaultValue: boolean) =>
  z
  .enum(["true", "false", "1", "0", "yes", "no"])
  .optional()
    .transform((value) =>
      value === undefined ? defaultValue : value === "true" || value === "1" || value === "yes",
    );

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("AI Resume Portfolio"),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_RESUME_BUCKET: z.string().default("resume-assets"),
  SUPABASE_PROJECT_IMAGES_BUCKET: z.string().default("project-images"),
  SUPABASE_OG_IMAGES_BUCKET: z.string().default("og-images"),
  SUPABASE_PRIVATE_UPLOADS_BUCKET: z.string().default("private-uploads"),
  ADMIN_EMAILS: z.string().optional(),
  CHAT_DEFAULT_LOCALE: z.enum(["th", "en"]).default("en"),
  CHAT_MAX_MESSAGE_LENGTH: z.coerce.number().int().positive().default(1500),
  CHAT_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(20000),
  CHAT_PROVIDER_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  CHAT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(600000),
  CHAT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(20),
  AI_PROVIDER_PRIORITY: z.string().default("groq,openrouter"),
  GROQ_ENABLED: booleanFromEnv(true),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.1-8b-instant"),
  OPENROUTER_ENABLED: booleanFromEnv(true),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_MODEL: z.string().default("openai/gpt-4o-mini"),
  OPENROUTER_SITE_URL: z.url().default("http://localhost:3000"),
  OPENROUTER_APP_NAME: z.string().default("AI Resume Portfolio"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  ENABLE_CONTEXT_DEBUG_LOGS: booleanFromEnv(false),
});

export const env = envSchema.parse(process.env);

export const adminEmails = env.ADMIN_EMAILS
  ? env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean)
  : [];

export const aiProviderPriority = env.AI_PROVIDER_PRIORITY.split(",")
  .map((provider) => provider.trim().toLowerCase())
  .filter(Boolean);
