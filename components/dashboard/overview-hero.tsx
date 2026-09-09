import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import type { OverviewData } from "@/lib/sector-data"

function MoMBadge({ pct }: { pct: number }) {
  const positive = pct >= 0
  const color = positive ? "var(--status-success)" : "var(--status-danger)"
  return (
    <Badge
      variant="outline"
      className="gap-0.5 border-transparent"
      style={{ backgroundColor: `${positive ? "rgba(87,219,123,0.15)" : "rgba(237,62,62,0.12)"}`, color }}
    >
      {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(pct)}% vs last month
    </Badge>
  )
}

function HeroCard({
  label,
  value,
  valueColor,
  momPct,
  footnote,
  footnoteColor,
  emphasis,
}: {
  label: string
  value: string
  valueColor?: string
  momPct?: number
  footnote?: string
  footnoteColor?: string
  emphasis?: boolean
}) {
  return (
    <Card
      className={
        emphasis
          ? "border-transparent bg-[#123F36] text-[#E3FFFA] shadow-[0_1px_2px_rgb(18_63_54/0.04),0_16px_32px_-12px_rgb(18_63_54/0.45)]"
          : undefined
      }
    >
      <CardHeader className="pb-1">
        <span
          className={
            emphasis
              ? "text-xs font-medium uppercase tracking-wide text-[#E3FFFA]/60"
              : "text-xs font-medium uppercase tracking-wide text-muted-foreground"
          }
        >
          {label}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span
          className="font-heading text-4xl font-semibold tracking-tight"
          style={{ color: emphasis ? "#7FE5D1" : valueColor }}
        >
          {value}
        </span>
        {momPct !== undefined ? <MoMBadge pct={momPct} /> : null}
        {footnote ? (
          <span className="text-xs font-medium" style={{ color: footnoteColor }}>
            {footnote}
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function OverviewHeroRow({ data }: { data: OverviewData }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <HeroCard
        label="Total spend"
        value={`$${data.totalSpend.toLocaleString()}`}
        momPct={data.spendMoM}
        emphasis
      />
      <HeroCard
        label="Total leads in"
        value={data.totalLeadsIn.toLocaleString()}
        valueColor="var(--foreground)"
        momPct={data.leadsMoM}
      />
      <HeroCard
        label="Total contacted"
        value={data.totalContacted.toLocaleString()}
        valueColor="var(--status-success)"
      />
      <HeroCard
        label="Total uncontacted"
        value={data.totalUncontacted.toLocaleString()}
        valueColor="var(--status-danger)"
        footnote="Requires attention"
        footnoteColor="var(--status-danger)"
      />
    </div>
  )
}

export function OverallContactRateCard({ data }: { data: OverviewData }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-8">
        <div className="flex shrink-0 flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Overall contact rate
          </span>
          <span className="font-heading text-4xl font-semibold tracking-tight">{data.contactRate}%</span>
          <span className="text-sm text-muted-foreground">
            {data.totalContacted.toLocaleString()} contacted · {data.totalUncontacted.toLocaleString()} uncontacted
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <ProgressPrimitive.Root value={data.contactRate} className="w-full">
            <ProgressTrack className="h-2">
              <ProgressIndicator
                style={{ background: "linear-gradient(90deg, #7FE5D1 0%, #123F36 100%)" }}
              />
            </ProgressTrack>
          </ProgressPrimitive.Root>
          <span className="text-sm text-muted-foreground">
            {data.totalContacted.toLocaleString()} contacted · {data.totalUncontacted.toLocaleString()} uncontacted
            across all sectors
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
