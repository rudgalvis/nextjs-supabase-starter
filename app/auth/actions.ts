"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { createServerActionClient } from "@/lib/supabase/server"

/**
 * Get the site URL from environment variable or current request origin
 */
const getSiteUrl = async () => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL
    }

    const headersList = await headers()
    const host = headersList.get("host")
    const protocol = headersList.get("x-forwarded-proto") || "http"

    return `${protocol}://${host}`
}

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
    const siteUrl = await getSiteUrl()

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
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
    const siteUrl = await getSiteUrl()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/reset-password`,
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
    const siteUrl = await getSiteUrl()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${siteUrl}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { url: data.url }
}
