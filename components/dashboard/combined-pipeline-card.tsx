import { ChevronRight } from "lucide-react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { getTrafficLight } from "@/lib/constants"

export function CombinedPipelineCard({ pipeline }: { pipeline: { stage: string; count: number }[] }) {
  const max = pipeline[0]?.count || 1
  const overallPct = pipeline.length ? Math.round((pipeline[pipeline.length - 1].count / max) * 100) : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base">Overall pipeline · all sectors combined</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-stretch justify-between gap-1">
          {pipeline.map((stage, i) => {
            const prev = pipeline[i - 1]
            const conv = prev ? Math.round((stage.count / prev.count) * 100) : null
            const light = conv !== null ? getTrafficLight(conv) : null
            return (
              <div key={stage.stage} className="flex flex-1 items-center gap-1">
                {i > 0 ? (
                  <div className="flex shrink-0 flex-col items-center gap-0.5 text-muted-foreground/60">
                    <ChevronRight className="size-4" />
                    {light ? (
                      <span className="text-xs font-medium tabular-nums" style={{ color: light.color }}>
                        {conv}%
                      </span>
                    ) : null}
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col items-center gap-0.5 text-center">
                  <span className="font-heading text-2xl font-semibold tabular-nums">
                    {stage.count.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{stage.stage}</span>
                </div>
              </div>
            )
          })}
        </div>
        <ProgressPrimitive.Root value={overallPct} className="w-full">
          <ProgressTrack className="h-1.5">
            <ProgressIndicator style={{ backgroundColor: "var(--accent)" }} />
          </ProgressTrack>
        </ProgressPrimitive.Root>
      </CardContent>
    </Card>
  )
}
