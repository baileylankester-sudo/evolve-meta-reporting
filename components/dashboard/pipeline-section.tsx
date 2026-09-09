import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ColoredProgress } from "@/components/dashboard/colored-progress"
import { getTrafficLight } from "@/lib/constants"
import type { Cohort } from "@/lib/sector-data"

const META_COLOR = "#1877F2"
const SEEK_COLOR = "#00A4E4"

function FunnelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-[18px] flex-1 overflow-hidden rounded-[4px]" style={{ backgroundColor: `${color}26` }}>
      <div
        className="h-full rounded-[4px] transition-all"
        style={{ width: `${Math.max(4, pct)}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ConversionLabel({ conv }: { conv: number | null }) {
  if (conv === null) return <span className="w-9 shrink-0 text-right text-xs text-muted-foreground/60">—</span>
  const light = getTrafficLight(conv)
  return (
    <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums" style={{ color: light.color }}>
      {conv}%
    </span>
  )
}

export function PipelineFunnelCard({
  funnelByChannel,
}: {
  funnelByChannel: { stage: string; meta: number; seek: number }[]
}) {
  const maxMeta = funnelByChannel[0]?.meta || 1
  const maxSeek = funnelByChannel[0]?.seek || 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Funnel · separate channel tracks</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2 pl-[92px] text-xs font-medium text-muted-foreground">
          <span className="flex-1 text-center" style={{ color: META_COLOR }}>
            Meta
          </span>
          <span className="w-9" />
          <span className="flex-1 text-center" style={{ color: SEEK_COLOR }}>
            Seek
          </span>
          <span className="w-9" />
        </div>
        {funnelByChannel.map((stage, i) => {
          const prev = funnelByChannel[i - 1]
          const metaConv = prev ? Math.round((stage.meta / prev.meta) * 100) : null
          const seekConv = prev ? Math.round((stage.seek / prev.seek) * 100) : null
          return (
            <div key={stage.stage} className="flex items-center gap-2">
              <span className="w-20 shrink-0 text-sm font-medium">{stage.stage}</span>
              <FunnelBar pct={(stage.meta / maxMeta) * 100} color={META_COLOR} />
              <ConversionLabel conv={metaConv} />
              <FunnelBar pct={(stage.seek / maxSeek) * 100} color={SEEK_COLOR} />
              <ConversionLabel conv={seekConv} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function CohortCard({ cohort, color }: { cohort: Cohort; color: string }) {
  const statusColor =
    cohort.status === "Mature" ? "var(--status-success)" : cohort.status === "Active" ? color : "var(--status-warning)"

  return (
    <Card size="sm" className="bg-[color:var(--color-surface-subtle)]">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold">{cohort.month}</span>
          <span className="text-xs text-muted-foreground">
            {cohort.leadCount} leads · avg {cohort.avgDays}d
          </span>
        </div>
        <Badge variant="outline" className="border-transparent" style={{ backgroundColor: `${statusColor}1f`, color: statusColor }}>
          {cohort.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {cohort.stageProgress.map((stage) => (
          <div key={stage.stage} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-xs text-muted-foreground">{stage.stage}</span>
            <ColoredProgress value={stage.pct} color={color} className="flex-1" trackClassName="h-2" />
            <span className="w-8 shrink-0 text-right text-xs tabular-nums">{stage.pct}%</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function CohortProgressCard({ cohorts, color }: { cohorts: Cohort[]; color: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Cohort progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {cohorts.map((cohort) => (
          <CohortCard key={cohort.month} cohort={cohort} color={color} />
        ))}
      </CardContent>
    </Card>
  )
}
