import Link from "next/link"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ColoredProgress } from "@/components/dashboard/colored-progress"
import type { OverviewSectorHealth } from "@/lib/sector-data"

function Metric({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold tabular-nums" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

function SectorHealthCard({ sector }: { sector: OverviewSectorHealth }) {
  return (
    <Link href={`/${sector.key}`} className="block">
      <Card
        className="h-full border-transparent transition-transform duration-200 hover:-translate-y-0.5"
        style={{ backgroundColor: `color-mix(in srgb, ${sector.color} 6%, var(--card))` }}
      >
        <CardHeader className="gap-0.5 pb-1">
          <span className="inline-flex items-center gap-2 font-heading text-sm font-semibold">
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: sector.color }} />
            {sector.name}
          </span>
          <span className="text-xs text-muted-foreground">{sector.divisions.join(" · ")}</span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Leads in" value={sector.leadsIn.toLocaleString()} />
            <Metric label="Spend" value={`$${sector.spend.toLocaleString()}`} />
            <Metric label="Contact rate" value={`${sector.contactRate}%`} color={sector.color} />
            <Metric
              label="Uncontacted"
              value={sector.uncontactedCount.toLocaleString()}
              color={sector.uncontactedCount > 0 ? "var(--status-danger)" : undefined}
            />
          </div>
          <div className="flex items-center gap-2">
            <ColoredProgress value={sector.contactRate} color={sector.color} className="flex-1" />
            <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums">{sector.contactRate}%</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function SectorHealthGrid({ sectors }: { sectors: OverviewSectorHealth[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {sectors.map((sector) => (
        <SectorHealthCard key={sector.key} sector={sector} />
      ))}
    </div>
  )
}
