import { createBrowserClient } from "@supabase/ssr"

import type { SupabaseSchema } from "@/lib/supabase/schema"

/**
 * Creates a Supabase client for use in browser/client components.
 * This client handles cookie management for authentication state.
 *
 * @returns Supabase client instance
 */
export function createClient() {
    return createBrowserClient<SupabaseSchema>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
