import { Badge } from "@/components/ui/badge"
import { SECTORS, getTrafficLight, type SectorKey } from "@/lib/constants"

export function SectorBadge({ sector }: { sector: SectorKey }) {
  const { name, color } = SECTORS[sector]
  return (
    <Badge
      variant="outline"
      className="border-transparent"
      style={{ backgroundColor: `${color}1a`, color }}
    >
      {name}
    </Badge>
  )
}

export function HealthBadge({ score }: { score: number }) {
  const { color, label } = getTrafficLight(score)
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-[color:var(--border)] bg-transparent"
      style={{ color }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </Badge>
  )
}
