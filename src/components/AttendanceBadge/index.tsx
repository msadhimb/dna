import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type AttendanceStatus =
  | "attending"
  | "not_attending"
  | "maybe"
  | "hadir"
  | "tidak_hadir"
  | "ragu"

const ATTENDANCE_BADGES: Record<
  AttendanceStatus,
  { label: string; color: string }
> = {
  attending: { label: "HADIR", color: "#16A34A" },
  hadir: { label: "HADIR", color: "#16A34A" },
  not_attending: { label: "TIDAK HADIR", color: "#EF4444" },
  tidak_hadir: { label: "TIDAK HADIR", color: "#EF4444" },
  maybe: { label: "RAGU", color: "#D4AF37" },
  ragu: { label: "RAGU", color: "#D4AF37" },
}

interface AttendanceBadgeProps {
  status: string
  className?: string
}

export function AttendanceBadge({ status, className }: AttendanceBadgeProps) {
  const badge =
    ATTENDANCE_BADGES[status as AttendanceStatus] ?? ATTENDANCE_BADGES.maybe

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-md border bg-transparent px-2.5 py-0.5 text-[9px] font-bold tracking-[0.2em]",
        className
      )}
      style={{ borderColor: badge.color, color: badge.color }}
    >
      {badge.label}
    </Badge>
  )
}
