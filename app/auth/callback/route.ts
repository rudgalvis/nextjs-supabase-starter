import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import type { SupabaseSchema } from "@/lib/supabase/schema"

export const GET = async (request: NextRequest) => {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const token = requestUrl.searchParams.get("token")
    const tokenHash = requestUrl.searchParams.get("token_hash")
    const email = requestUrl.searchParams.get("email")
    const type = requestUrl.searchParams.get("type") as
        | "signup"
        | "email_change"
        | "recovery"
        | "magiclink"
        | null
    const next = requestUrl.searchParams.get("next") ?? "/"

    // Create a response object that we can set cookies on
    let response = NextResponse.redirect(new URL(next, request.url))

    // Create Supabase client with cookie handling for Route Handler
    const supabase = createSupabaseServerClient<SupabaseSchema>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                        response.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Handle PKCE flow (code exchange)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return response
        }
    }

    // Handle direct token verification (for email verification)
    // Support both token and token_hash parameters
    if ((token || tokenHash) && type) {
        // Map Supabase email verification types to verifyOtp types
        const otpType =
            type === "signup"
                ? "signup"
                : type === "email_change"
                  ? "email_change"
                  : type === "recovery"
                    ? "recovery"
                    : type === "magiclink"
                      ? "magiclink"
                      : "email"

        const { error } = await supabase.auth.verifyOtp(
            tokenHash
                ? {
                      token_hash: tokenHash,
                      type: otpType,
                  }
                : ({
                      token: token!,
                      type: otpType,
                      ...(email && { email }),
                  } as any)
        )

        if (!error) {
            return response
        }
    }

    // Return the user to an error page with instructions
    const errorMessage = code
        ? "Could not exchange code for session"
        : token || tokenHash
          ? "Could not verify token"
          : "Missing authentication parameters"

    return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
}
