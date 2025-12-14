/* eslint-env node */
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { SupabaseSchema } from "@/lib/supabase/schema"

/**
 * Creates a Supabase client for use in Server Components and Route Handlers.
 * This client reads cookies from the request to maintain authentication state.
 *
 * @returns Supabase client instance
 */
export async function createServerClient() {
    const cookieStore = await cookies()

    return createSupabaseServerClient<SupabaseSchema>(
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
                            cookieStore.set(name, value, options as CookieOptions)
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

/**
 * Creates a Supabase client for use in Server Actions.
 * This is a convenience wrapper that uses the same cookie handling as createServerClient.
 *
 * @returns Supabase client instance
 */
export async function createServerActionClient() {
    return createServerClient()
}
