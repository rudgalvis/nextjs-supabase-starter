import type { PostgrestError } from "@supabase/supabase-js"

/**
 * Result pattern for consistent error handling across database queries.
 * All database operations return this type instead of throwing errors.
 */
export type Result<T> = {
    data: T | null
    error: Error | null
}

/**
 * Converts a Supabase response to the Result pattern.
 * Handles PostgrestError types and converts them to standard Error objects.
 */
export function toResult<T>(response: { data: T | null; error: PostgrestError | null }): Result<T> {
    if (response.error) {
        return {
            data: null,
            error: new Error(response.error.message),
        }
    }

    return {
        data: response.data,
        error: null,
    }
}
