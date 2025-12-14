"use client"

import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const VerifyEmailContent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token")
            const tokenHash = searchParams.get("token_hash")
            const type = searchParams.get("type")
            const email = searchParams.get("email")
            const next = searchParams.get("next") ?? "/"

            if (!token && !tokenHash) {
                setStatus("error")
                setErrorMessage("Missing verification token")
                return
            }

            if (!type) {
                setStatus("error")
                setErrorMessage("Missing verification type")
                return
            }

            const supabase = createClient()

            try {
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

                const { error } = tokenHash
                    ? await supabase.auth.verifyOtp({
                          token_hash: tokenHash,
                          type: otpType,
                      })
                    : await supabase.auth.verifyOtp({
                          token: token!,
                          type: otpType,
                          ...(email && { email }),
                      } as Parameters<typeof supabase.auth.verifyOtp>[0])

                if (error) {
                    setStatus("error")
                    setErrorMessage(error.message)
                    return
                }

                setStatus("success")
                // Small delay to show success state, then redirect
                setTimeout(() => {
                    router.push(next)
                }, 1000)
            } catch (error) {
                setStatus("error")
                setErrorMessage(
                    error instanceof Error ? error.message : "An unexpected error occurred"
                )
            }
        }

        verifyEmail()
    }, [searchParams, router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="bg-card mx-auto w-full max-w-md space-y-6 rounded-lg border p-8 text-center shadow-lg">
                {status === "verifying" && (
                    <>
                        <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                        <h1 className="text-2xl font-semibold">Verifying your email</h1>
                        <p className="text-muted-foreground">
                            Please wait while we confirm your email address...
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <svg
                                className="h-6 w-6 text-green-600 dark:text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold">Email verified!</h1>
                        <p className="text-muted-foreground">Redirecting you now...</p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                            <svg
                                className="h-6 w-6 text-red-600 dark:text-red-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-semibold">Verification failed</h1>
                        <p className="text-muted-foreground">
                            {errorMessage || "Could not verify your email"}
                        </p>
                        <button
                            onClick={() => router.push("/auth")}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-md px-4 py-2"
                        >
                            Go to sign in
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const VerifyEmailPage = () => (
    <Suspense
        fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="bg-card mx-auto w-full max-w-md space-y-6 rounded-lg border p-8 text-center shadow-lg">
                    <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
                    <h1 className="text-2xl font-semibold">Loading...</h1>
                </div>
            </div>
        }
    >
        <VerifyEmailContent />
    </Suspense>
)

export default VerifyEmailPage
