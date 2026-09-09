import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export function ColoredProgress({
  value,
  color,
  className,
  trackClassName,
}: {
  value: number
  color: string
  className?: string
  trackClassName?: string
}) {
  return (
    <ProgressPrimitive.Root value={value} className={className}>
      <ProgressTrack className={cn("h-[3px]", trackClassName)}>
        <ProgressIndicator style={{ backgroundColor: color }} />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}
