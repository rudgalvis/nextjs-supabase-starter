import Link from "next/link"

import { ComponentExample } from "@/components/component-example"
import { Button } from "@/components/ui/button"

const Page = () => (
    <>
        <nav className="border-b-border/50 bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
            <div className="container flex h-14 items-center justify-between px-4">
                <Link href="/" className="text-foreground font-semibold">
                    Home
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/auth">
                        <Button variant="outline">Auth</Button>
                    </Link>
                </div>
            </div>
        </nav>
        <ComponentExample />
    </>
)

export default Page
