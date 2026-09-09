import { Badge } from "@/components/ui/badge"

export function PageHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Badge
        variant="outline"
        className="w-fit gap-1.5 border-status-success/30 bg-status-success/10 text-[color:var(--status-success)]"
      >
        <span className="size-1.5 rounded-full bg-[color:var(--status-success)]" />
        Live data · updated today
      </Badge>
    </div>
  )
}
