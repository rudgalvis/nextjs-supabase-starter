import { Hero } from "@/components/blocks/hero"
import { SupabaseHealthClient } from "@/components/blocks/supabase-health/supabase-health"
import { Icons } from "@/components/ui/icons"
import { createServerClient } from "@/lib/supabase/server"

const Page = async () => {
    const supabase = await createServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    return (
        <>
            <Hero
                pill={{
                    text: "Supabase status",
                    icon: (
                        <SupabaseHealthClient
                            showLabel={false}
                            showRefreshButton={false}
                            showMessage={false}
                        />
                    ),
                }}
                content={{
                    title: "Start fast with",
                    titleHighlight: "Next.js & Supabase & Shadncn",
                    description:
                        "A production-ready starter template with authentication, database, and modern UI components. Get started in minutes.",
                    primaryAction: {
                        href: user ? "/settings" : "/auth",
                        text: user ? "Go to Settings" : "Get Started",
                        icon: <Icons.chevronRight className="h-4 w-4" />,
                    },
                    secondaryAction: {
                        href: "/auth",
                        text: "Learn More",
                    },
                }}
            />
        </>
    )
}

export default Page
