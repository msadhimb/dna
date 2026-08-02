import { Badge } from "@/components/ui/badge"

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

const ATTENDANCE = {
  hadir: { label: "HADIR", color: "#16A34A" },
  ragu: { label: "RAGU", color: "#D4AF37" },
  tidak_hadir: { label: "TIDAK HADIR", color: "#EF4444" },
} as const

export function CommentCard({ name, message, attendance, date, textPrimary, textSecondary, textMuted, surface, border }: CommentCardProps) {
  const att = ATTENDANCE[attendance]

  return (
    <div
      className="cs-card-item flex flex-col gap-5 p-8 transition-all duration-500"
      style={{
        background: surface,
        border: `1px solid ${border}`,
        borderTop: `2px solid ${att.color}`,
        borderRadius: "12px",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-signature text-2xl leading-tight font-bold" style={{ color: textPrimary }}>
          {name}
        </h3>
        <Badge
          style={{
            borderColor: att.color,
            color: att.color,
            background: "transparent",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            borderRadius: "6px",
            padding: "2px 10px",
          }}
        >
          {att.label}
        </Badge>
      </div>

      <p className="font-sans text-sm leading-relaxed" style={{ color: textSecondary }}>
        {message}
      </p>

      <div className="mt-auto flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: border }} />
        <span className="font-sans text-[9px] font-semibold tracking-[0.3em] uppercase" style={{ color: textMuted }}>
          {date}
        </span>
      </div>
    </div>
  )
}
