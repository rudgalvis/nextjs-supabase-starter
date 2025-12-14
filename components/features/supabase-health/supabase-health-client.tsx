"use client"

import { RefreshCwIcon } from "lucide-react"
import { useEffect, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/status"
import { type HealthCheck } from "@/lib/db/health"
import { delay } from "@/lib/utils"

import { refreshHealthCheck } from "./supabase-health-actions"

/**
 * Maps health check status to Status UI component status.
 * @param healthStatus - The health check status ("healthy" | "unhealthy")
 * @returns The corresponding Status component status
 */
function mapHealthStatusToStatus(healthStatus: "healthy" | "unhealthy"): "online" | "offline" {
    return healthStatus === "healthy" ? "online" : "offline"
}

/**
 * Delay helper function for 1 second wait
 */

/**
 * Client Component that displays Supabase health status with refresh capability.
 */
export const SupabaseHealthClient = ({
    initialData,
    initialError,
}: {
    initialData?: HealthCheck | null
    initialError?: Error | null
}) => {
    const [healthData, setHealthData] = useState<HealthCheck | null>(initialData ?? null)
    const [error, setError] = useState<Error | null>(initialError ?? null)
    const [isPending, startTransition] = useTransition()

    const handleRefresh = () => {
        startTransition(async () => {
            setError(null)
            const result = await refreshHealthCheck()

            // Hardcoded 1 second wait before update
            await delay(1000)

            if (result.error) {
                setError(result.error)
            } else {
                setError(null)
            }

            setHealthData(result.data)
        })
    }

    // Refresh on mount if initial data is not provided
    useEffect(() => {
        if (initialData === undefined) {
            handleRefresh()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Determine status based on current data or error state
    const status = healthData
        ? mapHealthStatusToStatus(healthData.status)
        : error
          ? "offline"
          : "offline"

    return (
        <div className="flex items-center gap-3">
            <Status status={status}>
                <StatusIndicator />
                <StatusLabel>{healthData?.status === "healthy" ? "Online" : "Offline"}</StatusLabel>
            </Status>

            <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isPending}
                aria-label="Refresh health check"
            >
                <RefreshCwIcon className={isPending ? "animate-spin" : ""} />
                Refresh
            </Button>

            {error && (
                <span className="text-destructive text-sm" role="alert">
                    {error.message}
                </span>
            )}

            {healthData?.message && !error && (
                <span className="text-muted-foreground text-sm">{healthData.message}</span>
            )}
        </div>
    )
}
