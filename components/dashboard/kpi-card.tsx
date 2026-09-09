import type { LucideIcon } from "lucide-react"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  accent,
}: {
  label: string
  value: string
  delta?: { value: string; positive: boolean }
  icon: LucideIcon
  accent?: string
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div
          className="flex size-8 items-center justify-center rounded-md"
          style={{
            backgroundColor: accent ? `${accent}1a` : "var(--accent)",
            color: accent ?? "var(--accent-foreground)",
          }}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-2">
        <span className="font-heading text-3xl font-semibold tracking-tight">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              delta.positive
                ? "text-[color:var(--status-success)]"
                : "text-[color:var(--status-danger)]"
            )}
          >
            {delta.positive ? (
              <ArrowUpRight className="size-3.5" />
            ) : (
              <ArrowDownRight className="size-3.5" />
            )}
            {delta.value}
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}
