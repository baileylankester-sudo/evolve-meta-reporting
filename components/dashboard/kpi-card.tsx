import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function KpiCard({
  label,
  value,
  delta,
  accent,
}: {
  label: string
  value: string
  delta?: { value: string; positive: boolean }
  accent?: string
}) {
  const rule = accent ?? "var(--accent)"
  return (
    <Card
      className="relative"
      style={{
        boxShadow: `inset 3px 0 0 0 ${rule}, 0 1px 2px rgb(18 63 54 / 0.04), 0 10px 28px -10px rgb(18 63 54 / 0.1)`,
      }}
    >
      <CardHeader className="pb-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-2">
        <span className="font-heading text-4xl font-semibold tracking-tight">
          {value}
        </span>
        {delta ? (
          <Badge
            variant="outline"
            className="gap-0.5 border-transparent"
            style={{
              backgroundColor: delta.positive
                ? "rgba(87,219,123,0.15)"
                : "rgba(237,62,62,0.12)",
              color: delta.positive
                ? "var(--status-success)"
                : "var(--status-danger)",
            }}
          >
            {delta.positive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {delta.value}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  )
}
