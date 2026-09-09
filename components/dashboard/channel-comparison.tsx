import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ChannelMetrics } from "@/lib/sector-data"

const META_COLOR = "#1877F2"
const SEEK_COLOR = "#00A4E4"

type Row = {
  label: string
  meta: string
  seek: string
  winner: "meta" | "seek"
  kind: "good" | "volume"
}

function buildRows(meta: ChannelMetrics, seek: ChannelMetrics): Row[] {
  return [
    {
      label: "Spend",
      meta: `$${meta.spend.toLocaleString()}`,
      seek: `$${seek.spend.toLocaleString()}`,
      winner: meta.spend <= seek.spend ? "meta" : "seek",
      kind: "volume",
    },
    {
      label: "Leads / Applications",
      meta: meta.leads.toLocaleString(),
      seek: seek.leads.toLocaleString(),
      winner: meta.leads >= seek.leads ? "meta" : "seek",
      kind: "volume",
    },
    {
      label: "Cost per lead",
      meta: `$${meta.cpl.toFixed(0)}`,
      seek: `$${seek.cpl.toFixed(0)}`,
      winner: meta.cpl <= seek.cpl ? "meta" : "seek",
      kind: "good",
    },
    {
      label: "Qualification rate",
      meta: `${meta.qualRate}%`,
      seek: `${seek.qualRate}%`,
      winner: meta.qualRate >= seek.qualRate ? "meta" : "seek",
      kind: "good",
    },
    {
      label: "Cost per qualified lead",
      meta: `$${meta.cplQualified.toFixed(0)}`,
      seek: `$${seek.cplQualified.toFixed(0)}`,
      winner: meta.cplQualified <= seek.cplQualified ? "meta" : "seek",
      kind: "good",
    },
    {
      label: "Placements",
      meta: meta.placements.toLocaleString(),
      seek: seek.placements.toLocaleString(),
      winner: meta.placements >= seek.placements ? "meta" : "seek",
      kind: "volume",
    },
    {
      label: "Cost per placement",
      meta: `$${meta.costPerPlacement.toLocaleString()}`,
      seek: `$${seek.costPerPlacement.toLocaleString()}`,
      winner: meta.costPerPlacement <= seek.costPerPlacement ? "meta" : "seek",
      kind: "good",
    },
    {
      label: "ROAS",
      meta: `${meta.roas.toFixed(1)}x`,
      seek: `${seek.roas.toFixed(1)}x`,
      winner: meta.roas >= seek.roas ? "meta" : "seek",
      kind: "good",
    },
  ]
}

function buildInsight(meta: ChannelMetrics, seek: ChannelMetrics): string {
  const volumeLeader = meta.leads >= seek.leads ? "Meta" : "Seek"
  const qualityLeader = meta.qualRate >= seek.qualRate ? "Meta" : "Seek"
  const cplLeader = meta.cpl <= seek.cpl ? "Meta" : "Seek"
  const other = qualityLeader === "Meta" ? "Seek" : "Meta"

  if (volumeLeader === cplLeader && qualityLeader !== volumeLeader) {
    return `${volumeLeader} generates more leads at a lower cost per lead, but ${qualityLeader} converts leads to qualified candidates at a higher rate — ${other}'s volume advantage is offset by ${qualityLeader.toLowerCase()}'s stronger qualification funnel.`
  }
  return `${volumeLeader} leads on volume and cost efficiency, while ${qualityLeader} holds the edge on qualification rate — worth testing incremental spend toward ${qualityLeader} if placement quality is the priority.`
}

export function ChannelComparison({
  meta,
  seek,
}: {
  meta: ChannelMetrics
  seek: ChannelMetrics
}) {
  const rows = buildRows(meta, seek)
  const insight = buildInsight(meta, seek)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Channel comparison · Meta vs Seek</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[1.4fr]">Metric</TableHead>
              <TableHead className="text-center">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: META_COLOR }} />
                  Meta
                </span>
              </TableHead>
              <TableHead className="text-center">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: SEEK_COLOR }} />
                  Seek
                </span>
              </TableHead>
              <TableHead className="w-[60px] text-center">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-sm text-muted-foreground">{row.label}</TableCell>
                <TableCell
                  className="text-center text-sm font-medium"
                  style={{ color: row.winner === "meta" ? "var(--status-success)" : undefined }}
                >
                  {row.meta}
                </TableCell>
                <TableCell
                  className="text-center text-sm font-medium"
                  style={{ color: row.winner === "seek" ? "var(--status-success)" : undefined }}
                >
                  {row.seek}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className="rounded-full border-transparent"
                    style={{
                      backgroundColor: row.kind === "good" ? "rgba(87,219,123,0.15)" : "rgba(37,99,235,0.12)",
                      color: row.kind === "good" ? "var(--status-success)" : "#2563EB",
                    }}
                  >
                    {row.winner === "meta" ? "Meta" : "Seek"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Card
          className="border"
          style={{ backgroundColor: "rgba(253,192,109,0.1)", borderColor: "rgba(253,192,109,0.3)" }}
        >
          <CardContent className="text-sm leading-relaxed text-foreground/80">{insight}</CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
