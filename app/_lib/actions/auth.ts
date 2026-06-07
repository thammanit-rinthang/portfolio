"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { createSupabaseSSRClient } from "../supabase/ssr";
import { adminEmails } from "../env";
import { verifyRateLimit, resetRateLimit } from "../rate-limit";
import { logger } from "../logger";

const loginSchema = z.object({
  email: z.string().email("Invalid email format").max(150, "Email cannot exceed 150 characters"),
  password: z.string().min(1, "Password is required").max(100, "Password cannot exceed 100 characters"),
});

export async function loginWithEmailAction(formData: FormData) {
  const clientHeaders = await headers();
  const ip = clientHeaders.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

  // Rate limit: max 5 login attempts per 5 minutes per IP
  const withinLimit = await verifyRateLimit(ip, "login", 5, 300000);
  if (!withinLimit) {
    logger.warn(`[AUTH_WARN] Rate limit triggered for IP ${ip} trying to login.`);
    return { error: "Too many login attempts. Please try again in 5 minutes." };
  }

  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const parseResult = loginSchema.safeParse({ email, password });
  if (!parseResult.success) {
    return { error: `Validation error: ${parseResult.error.issues.map(e => e.message).join(", ")}` };
  }

  const validated = parseResult.data;

  if (!adminEmails.includes(validated.email.toLowerCase())) {
    logger.warn(`[AUTH_WARN] Attempt to login with non-admin email: ${validated.email} from IP ${ip}`);
    return { error: "Unauthorized email." };
  }

  const supabase = await createSupabaseSSRClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.email,
    password: validated.password,
  });

  if (error) {
    logger.error(`[AUTH_ERROR] Login failed for user ${validated.email} from IP ${ip} | Error:`, error.message);
    return { error: error.message };
  }

  // Reset rate limit count on successful login
  await resetRateLimit(ip, "login");
  logger.info(`[AUDIT_LOG] User: ${validated.email} logged in successfully from IP ${ip}`);

  redirect("/admin");
}

export async function logoutAction() {
  try {
    const supabase = await createSupabaseSSRClient();
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email || "unknown";

    await supabase.auth.signOut();
    logger.info(`[AUDIT_LOG] User: ${email} logged out successfully`);
  } catch (error) {
    logger.error("Logout action error:", error);
  }
  redirect("/admin/login");
}

