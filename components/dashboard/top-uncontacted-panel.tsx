import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SectorBadge } from "@/components/dashboard/badges"
import { initials, type OverviewUncontacted } from "@/lib/sector-data"

export function TopUncontactedPanel({ candidates }: { candidates: OverviewUncontacted[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-heading text-base">Most overdue uncontacted leads · all sectors</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {candidates.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
          >
            <Avatar size="sm">
              <AvatarFallback
                style={{ backgroundColor: "rgba(237,62,62,0.15)", color: "var(--status-danger)" }}
              >
                {initials(c.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">{c.name}</span>
                <SectorBadge sector={c.sector} />
              </div>
              <span className="truncate text-xs text-muted-foreground">{c.consultant}</span>
            </div>
            <span className="shrink-0 text-sm font-semibold" style={{ color: "var(--status-danger)" }}>
              {c.days}d
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
