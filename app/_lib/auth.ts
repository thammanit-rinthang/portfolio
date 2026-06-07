import "server-only";

import { createSupabaseSSRClient } from "./supabase/ssr";
import { adminEmails } from "./env";

export async function verifyAdminSession() {
  const supabase = await createSupabaseSSRClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
    throw new Error("Forbidden");
  }

  return user;
}
