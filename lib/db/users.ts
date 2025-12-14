import type { SupabaseSchema } from "@/lib/supabase/schema"
import { createServerClient } from "@/lib/supabase/server"
import { toResult, type Result } from "@/lib/supabase/types"

type User = SupabaseSchema["public"]["Tables"]["users"]["Row"]
type InsertUser = SupabaseSchema["public"]["Tables"]["users"]["Insert"]
type UpdateUser = SupabaseSchema["public"]["Tables"]["users"]["Update"]

/**
 * Retrieves a user by their ID.
 *
 * @param id - The user's unique identifier
 * @returns Result containing the user data or an error
 */
export async function getUserById(id: string): Promise<Result<User>> {
    const supabase = await createServerClient()
    const response = await supabase.from("users").select("*").eq("id", id).single()

    return toResult(response)
}

/**
 * Retrieves a user by their email address.
 *
 * @param email - The user's email address
 * @returns Result containing the user data or an error
 */
export async function getUserByEmail(email: string): Promise<Result<User>> {
    const supabase = await createServerClient()
    const response = await supabase.from("users").select("*").eq("email", email).single()

    return toResult(response)
}

/**
 * Creates a new user.
 *
 * @param data - The user data to insert
 * @returns Result containing the created user data or an error
 */
export async function createUser(data: InsertUser): Promise<Result<User>> {
    const supabase = await createServerClient()
    const response = await supabase.from("users").insert(data).select().single()

    return toResult(response)
}

/**
 * Updates an existing user.
 *
 * @param id - The user's unique identifier
 * @param data - The user data to update
 * @returns Result containing the updated user data or an error
 */
export async function updateUser(id: string, data: UpdateUser): Promise<Result<User>> {
    const supabase = await createServerClient()
    const response = await supabase.from("users").update(data).eq("id", id).select().single()

    return toResult(response)
}
