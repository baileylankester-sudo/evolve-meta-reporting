import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ColoredProgress } from "@/components/dashboard/colored-progress"
import type { SectorAdData } from "@/lib/sector-data"

function DeltaBadge({ pct, invert }: { pct: number; invert?: boolean }) {
  const positive = invert ? pct <= 0 : pct >= 0
  const color = positive ? "var(--status-success)" : "var(--status-danger)"
  return (
    <Badge
      variant="outline"
      className="gap-0.5 border-transparent"
      style={{ backgroundColor: `${color}26`, color }}
    >
      {pct >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(pct)}% vs last month
    </Badge>
  )
}

function MetricCard({
  label,
  value,
  deltaPct,
  invert,
  color,
}: {
  label: string
  value: string
  deltaPct: number
  invert?: boolean
  color: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <span className="font-heading text-2xl font-semibold" style={{ color }}>
          {value}
        </span>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent pt-0">
        <DeltaBadge pct={deltaPct} invert={invert} />
      </CardFooter>
    </Card>
  )
}

export function KpiStrip({ data, color }: { data: SectorAdData; color: string }) {
  const { kpis, contactRate } = data

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:[grid-template-columns:repeat(4,1fr)_1.4fr]">
      <MetricCard
        label="Total spend"
        value={`$${kpis.totalSpend.toLocaleString()}`}
        deltaPct={kpis.spendDeltaPct}
        color={color}
      />
      <MetricCard
        label="Leads in"
        value={kpis.leadsIn.toLocaleString()}
        deltaPct={kpis.leadsDeltaPct}
        color={color}
      />
      <MetricCard
        label="Cost per lead"
        value={`$${kpis.costPerLead.toFixed(0)}`}
        deltaPct={kpis.cplDeltaPct}
        invert
        color={color}
      />
      <MetricCard
        label="Cost per placement"
        value={`$${kpis.costPerPlacement.toLocaleString()}`}
        deltaPct={kpis.cppDeltaPct}
        invert
        color={color}
      />

      <Card
        size="sm"
        className="border"
        style={{ borderColor: "rgba(18,63,54,0.15)", backgroundColor: "#FAFAFA" }}
      >
        <CardHeader>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Contact rate</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="font-heading text-[28px] font-semibold leading-none" style={{ color }}>
              {contactRate.rate}%
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--status-danger)" }}>
              {contactRate.uncontactedCount} uncontacted
            </span>
          </div>
          <ColoredProgress value={contactRate.rate} color={color} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {contactRate.contactedCount} of {contactRate.totalLeads} contacted
            </span>
            <span>Avg {contactRate.avgDaysToContact}d to contact</span>
            <span>{contactRate.qualifiedCount} qualified</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
