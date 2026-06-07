import "server-only";
import { env } from "./env";

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

type LogLevel = keyof typeof LOG_LEVELS;

const currentLevel = LOG_LEVELS[env.LOG_LEVEL as LogLevel] ?? 1;

function sanitize(msg: string): string {
  let sanitized = msg;
  if (env.GROQ_API_KEY && env.GROQ_API_KEY.length > 5) {
    sanitized = sanitized.replaceAll(env.GROQ_API_KEY, "[REDACTED_GROQ_KEY]");
  }
  if (env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY.length > 5) {
    sanitized = sanitized.replaceAll(env.OPENROUTER_API_KEY, "[REDACTED_OPENROUTER_KEY]");
  }
  if (env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_SERVICE_ROLE_KEY.length > 5) {
    sanitized = sanitized.replaceAll(env.SUPABASE_SERVICE_ROLE_KEY, "[REDACTED_SERVICE_KEY]");
  }
  if (env.NEXT_PUBLIC_SUPABASE_ANON_KEY && env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 5) {
    sanitized = sanitized.replaceAll(env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "[REDACTED_ANON_KEY]");
  }
  
  // Redact DB connection strings
  sanitized = sanitized.replace(/(postgres(?:ql)?:\/\/)([^:]+):([^@]+)(@)/g, "$1[REDACTED_USER]:[REDACTED_PASSWORD]$4");
  
  return sanitized;
}

function formatArgs(args: unknown[]): string {
  return args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.message}\nStack: ${arg.stack || ""}`;
      }
      if (typeof arg === "object" && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    })
    .join(" ");
}

export const logger = {
  debug(...args: unknown[]) {
    if (currentLevel <= LOG_LEVELS.debug) {
      console.log(sanitize(`[DEBUG] ${formatArgs(args)}`));
    }
  },
  info(...args: unknown[]) {
    if (currentLevel <= LOG_LEVELS.info) {
      console.info(sanitize(`[INFO] ${formatArgs(args)}`));
    }
  },
  warn(...args: unknown[]) {
    if (currentLevel <= LOG_LEVELS.warn) {
      console.warn(sanitize(`[WARN] ${formatArgs(args)}`));
    }
  },
  error(...args: unknown[]) {
    if (currentLevel <= LOG_LEVELS.error) {
      console.error(sanitize(`[ERROR] ${formatArgs(args)}`));
    }
  },
};

