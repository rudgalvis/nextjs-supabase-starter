"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import HeroBadge from "@/components/ui/hero-badge"
import { cn } from "@/lib/utils"

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

interface HeroContentProps {
    title: string
    titleHighlight?: string
    description: string
    primaryAction?: {
        href: string
        text: string
        icon?: React.ReactNode
    }
    secondaryAction?: {
        href: string
        text: string
        icon?: React.ReactNode
    }
}

const HeroContent = ({
    title,
    titleHighlight,
    description,
    primaryAction,
    secondaryAction,
}: HeroContentProps) => (
    <div className="flex flex-col space-y-4">
        <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
        >
            {title} {titleHighlight && <span className="text-primary">{titleHighlight}</span>}
        </motion.h1>
        <motion.p
            className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease }}
        >
            {description}
        </motion.p>
        <motion.div
            className="flex flex-col gap-4 pt-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease }}
        >
            {primaryAction && (
                <Link
                    href={primaryAction.href}
                    className={cn(
                        buttonVariants({ size: "lg" }),
                        "w-full justify-center gap-2 sm:w-auto"
                    )}
                >
                    {primaryAction.icon}
                    {primaryAction.text}
                </Link>
            )}
            {secondaryAction && (
                <Link
                    href={secondaryAction.href}
                    className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "w-full justify-center gap-2 sm:w-auto"
                    )}
                >
                    {secondaryAction.icon}
                    {secondaryAction.text}
                </Link>
            )}
        </motion.div>
    </div>
)

interface HeroProps {
    pill?: {
        href?: string
        text: string
        icon?: React.ReactNode
        endIcon?: React.ReactNode
        variant?: "default" | "outline" | "ghost"
        size?: "sm" | "md" | "lg"
        className?: string
    }
    content: HeroContentProps
    preview?: React.ReactNode
}

const Hero = ({ pill, content, preview }: HeroProps) => (
    <div className="relative container overflow-hidden">
        <div className="flex min-h-[calc(100vh-64px)] flex-col items-center px-4 py-8 md:px-8 lg:flex-row lg:px-12">
            <div className="flex w-full flex-col items-start gap-4 lg:max-w-2xl">
                {pill && <HeroBadge {...pill} />}
                <HeroContent {...content} />
            </div>
            {preview && <div className="mt-12 w-full lg:mt-0 lg:max-w-xl lg:pl-16">{preview}</div>}
        </div>
    </div>
)

export { Hero }
