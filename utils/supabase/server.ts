"use server"
import { createClient as supabase } from "@supabase/supabase-js"

export async function createClient() {
  return supabase(
    process.env.SUPABASE_URL!,
    // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    process.env.SUPABASE_ROLE_KEY!
  )
}
import { cookies } from 'next/headers'
import { createServerClient }       from "@supabase/ssr"

export async function createClientServer() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}