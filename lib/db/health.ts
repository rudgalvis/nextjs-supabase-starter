import { createServerClient } from "@/lib/supabase/server"
import type { Result } from "@/lib/supabase/types"

/**
 * Health check response indicating Supabase connectivity status.
 */
export type HealthCheck = {
    status: "healthy" | "unhealthy"
    timestamp: string
    message: string
}

/**
 * Checks if Supabase is accessible and responsive.
 * Performs a simple query to verify database connectivity.
 *
 * @returns Result containing health check data or an error
 */
export async function checkSupabaseHealth(): Promise<Result<HealthCheck>> {
    try {
        const supabase = await createServerClient()

        // Perform a simple query to check connectivity
        // Using auth.getSession() as it's a lightweight operation that doesn't require any tables
        const { error } = await supabase.auth.getSession()

        if (error) {
            return {
                data: {
                    status: "unhealthy",
                    timestamp: new Date().toISOString(),
                    message: `Supabase connection failed: ${error.message}`,
                },
                error: null,
            }
        }

        return {
            data: {
                status: "healthy",
                timestamp: new Date().toISOString(),
                message: "Supabase is accessible and responsive",
            },
            error: null,
        }
    } catch (error) {
        return {
            data: {
                status: "unhealthy",
                timestamp: new Date().toISOString(),
                message: error instanceof Error ? error.message : "Unknown error occurred",
            },
            error: error instanceof Error ? error : new Error("Unknown error"),
        }
    }
}
