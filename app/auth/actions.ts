"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createServerActionClient } from "@/lib/supabase/server"

/**
 * Server Action to sign in a user with email and password.
 */
export const signIn = async (email: string, password: string) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/")
}

/**
 * Server Action to sign up a new user with email and password.
 */
export const signUp = async (email: string, password: string, name?: string) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000"}/auth/callback`,
            data: {
                name: name || email.split("@")[0],
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Server Action to sign out the current user.
 */
export const signOut = async () => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/auth")
}

/**
 * Server Action to send a password reset email.
 */
export const forgotPassword = async (email: string) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000"}/auth/reset-password`,
    })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

/**
 * Server Action to reset password with a new password.
 */
export const resetPassword = async (newPassword: string) => {
    const supabase = await createServerActionClient()

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/", "layout")
    redirect("/auth")
}

/**
 * Server Action to sign in with OAuth provider.
 * Returns the OAuth URL that should be used to redirect the user.
 */
export const signInWithOAuth = async (provider: "google" | "github") => {
    const supabase = await createServerActionClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000"}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { url: data.url }
}
