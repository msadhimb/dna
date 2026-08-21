import { AttendanceBadge } from "@/components/AttendanceBadge"

interface CommentCardProps {
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
  date: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  surface: string
  border: string
}

export function CommentCard({
  name,
  message,
  attendance,
  date,
  textPrimary,
  textSecondary,
  textMuted,
  surface,
  border,
}: CommentCardProps) {
  return (
    <div
      className="cs-card-item flex flex-col gap-5 rounded-xl border p-8 transition-all duration-500"
      style={{
        background: surface,
        borderTopWidth: "2px",
        borderTopColor:
          attendance === "hadir"
            ? "#16A34A"
            : attendance === "tidak_hadir"
              ? "#EF4444"
              : "#D4AF37",
        borderRightColor: border,
        borderBottomColor: border,
        borderLeftColor: border,
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <h3
          className="font-signature text-2xl leading-tight tracking-[0.1em] font-bold"
          style={{ color: textPrimary }}
        >
          {name}
        </h3>
        <AttendanceBadge status={attendance} />
      </div>

      <p
        className="font-sans text-xs leading-relaxed md:text-sm"
        style={{ color: textSecondary }}
      >
        {message}
      </p>

      <div className="mt-auto flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: border }} />
        <span
          className="font-sans text-[9px] font-semibold tracking-[0.3em] uppercase"
          style={{ color: textMuted }}
        >
          {date}
        </span>
      </div>
    </div>
  )
}
