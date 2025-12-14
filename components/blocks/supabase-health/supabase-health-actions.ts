"use server"

import { checkSupabaseHealth } from "@/lib/db/health"

/**
 * Server Action to refresh the health check.
 * @returns Result containing health check data or an error
 */
export const refreshHealthCheck = async () => await checkSupabaseHealth()
