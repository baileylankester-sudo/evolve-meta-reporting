"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ProcessingOverlay({ steps }: { steps: string[] }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    setVisibleCount(0)
    setComplete(false)

    const timeouts: number[] = []
    steps.forEach((_, index) => {
      timeouts.push(
        window.setTimeout(() => setVisibleCount(index + 1), 600 * (index + 1))
      )
    })
    timeouts.push(
      window.setTimeout(() => setComplete(true), 600 * (steps.length + 1) + 300)
    )

    return () => timeouts.forEach((t) => window.clearTimeout(t))
  }, [steps])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(252,252,252,0.9)] backdrop-blur-sm">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">
        {complete ? (
          <>
            <div
              className="flex size-12 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(87,219,123,0.15)" }}
            >
              <Check className="size-6" style={{ color: "var(--status-success)" }} />
            </div>
            <p className="font-heading text-xl font-semibold text-foreground">
              Dashboard updated
            </p>
            <Button size="lg" nativeButton={false} render={<Link href="/overview" />}>
              View overview
              <ArrowRight className="size-4" />
            </Button>
          </>
        ) : (
          <>
            <Loader2 className="size-8 animate-spin" style={{ color: "#123F36" }} />
            <p className="text-base font-medium text-foreground">Processing your data...</p>
          </>
        )}

        {!complete ? (
          <div className="flex w-full flex-col items-start gap-1.5">
            {steps.slice(0, visibleCount).map((step, index) => (
              <p
                key={step}
                className="animate-in fade-in flex items-center gap-1.5 text-sm duration-500"
                style={{ color: "var(--status-success)", animationDelay: `${index * 50}ms` }}
              >
                <Check className="size-3.5 shrink-0" />
                {step}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
