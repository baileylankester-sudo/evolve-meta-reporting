import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { OverviewData } from "@/lib/sector-data"

function MoMBadge({ pct }: { pct: number }) {
  const positive = pct >= 0
  return (
    <span
      className={cn(
        "flex items-center gap-0.5 text-sm font-medium",
        positive ? "text-[color:var(--status-success)]" : "text-[color:var(--status-danger)]"
      )}
    >
      {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
      {Math.abs(pct)}% vs last month
    </span>
  )
}

function HeroCard({
  label,
  value,
  valueColor,
  momPct,
  footnote,
  footnoteColor,
}: {
  label: string
  value: string
  valueColor?: string
  momPct?: number
  footnote?: string
  footnoteColor?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <span className="font-heading text-3xl font-semibold tracking-tight" style={{ color: valueColor }}>
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
      <HeroCard label="Total spend" value={`$${data.totalSpend.toLocaleString()}`} momPct={data.spendMoM} />
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
          <span className="text-sm font-medium text-muted-foreground">Overall contact rate</span>
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
