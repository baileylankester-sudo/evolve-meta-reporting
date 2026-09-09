import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ColoredProgress } from "@/components/dashboard/colored-progress"
import type { ChannelMetrics, SectorAdData } from "@/lib/sector-data"

const META_COLOR = "#1877F2"
const SEEK_COLOR = "#00A4E4"
const SUCCESS = "var(--status-success)"
const WARNING = "var(--status-warning)"

function GpHero({ gp, color }: { gp: SectorAdData["gp"]; color: string }) {
  const total = gp.confirmed + gp.pipeline + gp.potential
  const legend = [
    { label: "Confirmed", value: gp.confirmed, color: SUCCESS },
    { label: "Pipeline", value: gp.pipeline, color: WARNING },
    { label: "Potential", value: gp.potential, color: "var(--muted-foreground)" },
  ]

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total confirmed GP</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <span className="font-heading text-4xl font-semibold" style={{ color: SUCCESS }}>
            ${gp.confirmed.toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground">From {gp.placementsCount} placements</p>
        </div>
        <div className="flex h-2 w-full overflow-hidden rounded-full">
          {legend.map((segment) => (
            <div
              key={segment.label}
              style={{ width: `${(segment.value / total) * 100}%`, backgroundColor: segment.color }}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {legend.map((segment) => (
            <div key={segment.label} className="flex items-center gap-1.5 text-xs">
              <span className="size-1.5 rounded-full" style={{ backgroundColor: segment.color }} />
              <span className="text-muted-foreground">{segment.label}</span>
              <span className="font-medium">${segment.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function roasPct(roas: number) {
  return Math.max(4, Math.min(100, 60 + (roas - 3) * 20))
}

function RoasRow({ label, roas, dotColor }: { label: string; roas: number; dotColor: string }) {
  const above = roas >= 3
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
          {label}
        </span>
        <span className="font-semibold" style={{ color: SUCCESS }}>
          {roas.toFixed(1)}x
        </span>
      </div>
      <ColoredProgress value={roasPct(roas)} color={SUCCESS} trackClassName="h-2" />
      <span className="text-xs text-muted-foreground">
        {above ? "Above" : "Below"} 3x benchmark
      </span>
    </div>
  )
}

function RoasCard({ meta, seek }: { meta: ChannelMetrics; seek: ChannelMetrics }) {
  const combined =
    Math.round(((meta.roas * meta.spend + seek.roas * seek.spend) / (meta.spend + seek.spend)) * 10) / 10

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">ROAS · vs 3x benchmark</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <RoasRow label="Meta" roas={meta.roas} dotColor={META_COLOR} />
        <RoasRow label="Seek" roas={seek.roas} dotColor={SEEK_COLOR} />
        <Separator />
        <RoasRow label="Combined" roas={combined} dotColor="var(--foreground)" />
      </CardContent>
    </Card>
  )
}

function ChannelCppCard({
  label,
  dotColor,
  cost,
  momPct,
  avgDays,
}: {
  label: string
  dotColor: string
  cost: number
  momPct: number
  avgDays: number
}) {
  const positive = momPct <= 0
  return (
    <Card size="sm" className="bg-[color:var(--color-surface-subtle)]">
      <CardContent className="flex flex-col gap-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            <span className="size-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
            {label}
          </span>
          <span className="text-sm font-semibold">${cost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Avg {avgDays}d lead → placement</span>
          <Badge
            variant="outline"
            className="gap-0.5 border-transparent"
            style={{
              backgroundColor: positive ? "rgba(87,219,123,0.15)" : "rgba(237,62,62,0.12)",
              color: positive ? SUCCESS : "var(--status-danger)",
            }}
          >
            {momPct <= 0 ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
            {Math.abs(momPct)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function CostPerPlacementCard({
  meta,
  seek,
  avgDaysMeta,
  avgDaysSeek,
}: {
  meta: ChannelMetrics
  seek: ChannelMetrics
  avgDaysMeta: number
  avgDaysSeek: number
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Cost per placement</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ChannelCppCard label="Meta" dotColor={META_COLOR} cost={meta.costPerPlacement} momPct={-6} avgDays={avgDaysMeta} />
        <ChannelCppCard label="Seek" dotColor={SEEK_COLOR} cost={seek.costPerPlacement} momPct={4} avgDays={avgDaysSeek} />
      </CardContent>
    </Card>
  )
}

export function GpRoiSection({ data, color }: { data: SectorAdData; color: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:[grid-template-columns:1.4fr_1fr_1fr]">
      <GpHero gp={data.gp} color={color} />
      <RoasCard meta={data.channels.meta} seek={data.channels.seek} />
      <CostPerPlacementCard
        meta={data.channels.meta}
        seek={data.channels.seek}
        avgDaysMeta={data.contactRate.avgDaysToContact + 18}
        avgDaysSeek={data.contactRate.avgDaysToContact + 14}
      />
    </div>
  )
}
