import { AttendanceBadge } from "@/components/AttendanceBadge"
import { Card } from "@/components/Card"

interface CommentCardProps {
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
  date: string
  
  textPrimary?: string
  
  textSecondary?: string
  
  textMuted?: string
  
  surface?: string
  
  border?: string
  
  borderAccent?: string
  
  isDark?: boolean
  
  accent?: string
}

export function CommentCard({
  name,
  message,
  attendance,
  date,
}: CommentCardProps) {
  const attendanceColor =
    attendance === "hadir"
      ? "#16A34A"
      : attendance === "tidak_hadir"
        ? "#EF4444"
        : "#D4AF37"

  return (
    <Card
      withTopLine={false}
      withCorners
      className="cs-card-item gap-5 p-8 transition-all duration-500"
      style={{
        borderTopWidth: "2px",
        borderTopColor: attendanceColor,
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <h3 className="font-signature text-2xl leading-tight tracking-[0.1em] font-bold text-wedding-text-primary">
          {name}
        </h3>
        <AttendanceBadge status={attendance} />
      </div>

      <p className="font-sans text-xs leading-relaxed md:text-sm text-wedding-text-secondary">
        {message}
      </p>

      <div className="mt-auto flex items-center gap-3">
        <span className="h-px flex-1 bg-wedding-border" />
        <span className="font-sans text-[9px] font-semibold tracking-[0.3em] uppercase text-wedding-text-muted">
          {date}
        </span>
      </div>
    </Card>
  )
}
