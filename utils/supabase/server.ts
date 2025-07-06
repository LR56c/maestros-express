"use server"
import { createClient as supabase } from "@supabase/supabase-js"

export async function createClient() {
  return supabase(
    process.env.SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    process.env.SUPABASE_ROLE_KEY!
  )
}