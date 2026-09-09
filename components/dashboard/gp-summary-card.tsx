import { Upload } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { OverviewData } from "@/lib/sector-data"

const META_COLOR = "#1877F2"
const SEEK_COLOR = "#00A4E4"

function RoasRow({ label, roas, dotColor }: { label: string; roas: number; dotColor: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="inline-flex items-center gap-1.5 font-medium">
        <span className="size-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
        {label} ROAS
      </span>
      <span className="font-semibold" style={{ color: "var(--status-success)" }}>
        {roas.toFixed(1)}x
      </span>
    </div>
  )
}

export function GpSummaryCard({ data }: { data: OverviewData }) {
  if (data.gp.confirmed <= 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-heading text-base">GP summary</CardTitle>
        </CardHeader>
        <CardContent className="flex h-full min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center">
          <Upload className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Upload a GP report to see ROI data</p>
          <Button variant="outline" size="sm" render={<Link href="/upload" />}>
            Upload now
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-heading text-base">GP summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total GP</span>
          <span className="font-heading text-3xl font-semibold" style={{ color: "var(--status-success)" }}>
            ${data.gp.confirmed.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">From {data.gp.placementsCount} placements</span>
        </div>
        <Separator />
        <RoasRow label="Meta" roas={data.gp.metaRoas} dotColor={META_COLOR} />
        <RoasRow label="Seek" roas={data.gp.seekRoas} dotColor={SEEK_COLOR} />
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Cost per placement</span>
          <span className="font-semibold">${data.gp.costPerPlacement.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}
