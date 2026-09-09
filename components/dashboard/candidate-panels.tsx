import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getTrafficLight } from "@/lib/constants"
import { initials, type CandidateRef, type InProgressCandidate, type PlacedCandidate } from "@/lib/sector-data"

const DANGER = "var(--status-danger)"
const SUCCESS = "var(--status-success)"

function urgencyStyle(days: number) {
  if (days >= 8) return { bg: "rgba(237,62,62,0.08)", border: "rgba(237,62,62,0.2)" }
  if (days >= 4) return { bg: "rgba(253,192,109,0.1)", border: "rgba(253,192,109,0.25)" }
  return { bg: "transparent", border: "rgba(18,63,54,0.1)" }
}

function UncontactedCard({ candidate }: { candidate: CandidateRef }) {
  const urgency = urgencyStyle(candidate.days)
  return (
    <div
      className="flex items-center gap-3 rounded-lg border p-3"
      style={{ backgroundColor: urgency.bg, borderColor: urgency.border }}
    >
      <Avatar size="sm">
        <AvatarFallback style={{ backgroundColor: "rgba(237,62,62,0.15)", color: DANGER }}>
          {initials(candidate.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{candidate.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {candidate.division} · {candidate.consultant}
        </span>
      </div>
      <span className="shrink-0 text-sm font-semibold" style={{ color: DANGER }}>
        {candidate.days}d
      </span>
    </div>
  )
}

export function UncontactedPanel({ candidates, total }: { candidates: CandidateRef[]; total: number }) {
  const remaining = total - candidates.length
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="font-heading text-base">Uncontacted</CardTitle>
        <Badge variant="destructive">{total}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {candidates.map((c) => (
          <UncontactedCard key={c.id} candidate={c} />
        ))}
        {remaining > 0 ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
            + {remaining} more
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

const VELOCITY_META: Record<InProgressCandidate["velocity"], { label: string; color: string }> = {
  fast: { label: "fast", color: SUCCESS },
  onTrack: { label: "on track", color: "var(--status-warning)" },
  slow: { label: "slow", color: DANGER },
}

function InProgressCard({ candidate, accent }: { candidate: InProgressCandidate; accent: string }) {
  const velocity = VELOCITY_META[candidate.velocity]
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Avatar size="sm">
        <AvatarFallback style={{ backgroundColor: `${accent}26`, color: accent }}>
          {initials(candidate.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{candidate.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {candidate.division} · {candidate.consultant}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-sm font-semibold tabular-nums">{candidate.days}d</span>
        <Badge variant="outline" className="border-transparent" style={{ backgroundColor: `${velocity.color}1f`, color: velocity.color }}>
          {velocity.label}
        </Badge>
      </div>
    </div>
  )
}

export function InProgressPanel({
  candidates,
  stages,
  accent,
}: {
  candidates: InProgressCandidate[]
  stages: readonly string[]
  accent: string
}) {
  const groups = stages
    .map((stage) => ({ stage, items: candidates.filter((c) => c.stage === stage) }))
    .filter((g) => g.items.length > 0)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="font-heading text-base">In progress</CardTitle>
        <Badge variant="secondary">{candidates.length}</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {groups.map((group) => {
          const avgDays = group.items.reduce((s, c) => s + c.days, 0) / group.items.length
          const light = getTrafficLight(Math.round(100 - avgDays * 3))
          return (
            <div key={group.stage} className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: light.color }}>
                {group.stage}
              </span>
              {group.items.map((c) => (
                <InProgressCard key={c.id} candidate={c} accent={accent} />
              ))}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function PlacedCard({ candidate }: { candidate: PlacedCandidate }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <Avatar size="sm">
        <AvatarFallback style={{ backgroundColor: "rgba(87,219,123,0.18)", color: SUCCESS }}>
          {initials(candidate.name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium">{candidate.name}</span>
        <span className="truncate text-xs text-muted-foreground">
          {candidate.division} · {candidate.consultant}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-sm font-semibold" style={{ color: SUCCESS }}>
          ${candidate.gp.toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">{candidate.daysToPlace}d to place</span>
      </div>
    </div>
  )
}

export function PlacedPanel({ candidates }: { candidates: PlacedCandidate[] }) {
  const totalGp = candidates.reduce((sum, c) => sum + c.gp, 0)
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="font-heading text-base">Placed this period</CardTitle>
        <Badge variant="outline" className="border-transparent" style={{ backgroundColor: "rgba(87,219,123,0.15)", color: SUCCESS }}>
          {candidates.length}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {candidates.map((c) => (
          <PlacedCard key={c.id} candidate={c} />
        ))}
        <div className="flex justify-end rounded-lg border border-border p-3">
          <span className="text-sm font-semibold" style={{ color: SUCCESS }}>
            Total GP: ${totalGp.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
