import { checkSupabaseHealth } from "@/lib/db/health"

import { SupabaseHealthClient } from "./supabase-health-client"

/**
 * Server Component wrapper that fetches initial health check data
 * and passes it to the Client Component.
 */
export const SupabaseHealth = async () => {
    const { data, error } = await checkSupabaseHealth()

    return <SupabaseHealthClient initialData={data} initialError={error} />
}
