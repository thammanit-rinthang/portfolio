import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "../env-public";

export function createSupabaseBrowserClient() {
  return createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
