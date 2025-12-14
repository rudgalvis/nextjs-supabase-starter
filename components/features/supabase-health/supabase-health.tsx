import { SupabaseHealthClient } from "./supabase-health-client"

/**
 * Server Component wrapper that fetches initial health check data
 * and passes it to the Client Component.
 */
export const SupabaseHealth = async () => (
    // Commented so it would not block page load
    // const { data, error } = await checkSupabaseHealth()

    <SupabaseHealthClient />
)
