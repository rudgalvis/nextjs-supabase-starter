import { redirect } from "next/navigation"

import { signOut } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { createServerClient } from "@/lib/supabase/server"

const handleSignOut = async (_formData: FormData) => {
    "use server"
    await signOut()
}

const SettingsPage = async () => {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth")
    }

    return (
        <>
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Manage your account settings and preferences
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            Your account details and authentication information
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm font-medium">Email</div>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm font-medium">User ID</div>
                            <p className="text-muted-foreground font-mono text-xs break-all">
                                {user.id}
                            </p>
                        </div>
                        {user.user_metadata?.name && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="text-muted-foreground text-sm font-medium">
                                        Name
                                    </div>
                                    <p className="text-sm">{user.user_metadata.name}</p>
                                </div>
                            </>
                        )}
                        <Separator />
                        <div className="space-y-2">
                            <div className="text-muted-foreground text-sm font-medium">
                                Account Created
                            </div>
                            <p className="text-sm">
                                {new Date(user.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                        <form action={handleSignOut}>
                            <Button type="submit" variant="destructive">
                                Sign Out
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default SettingsPage
