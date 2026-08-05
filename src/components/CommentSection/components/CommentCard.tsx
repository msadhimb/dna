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
  const att = ATTENDANCE[attendance]

  return (
    <div
      className="cs-card-item flex flex-col gap-5 rounded-xl border p-8 transition-all duration-500"
      style={{
        background: surface,
        borderTopWidth: "2px",
        borderTopColor: att.color,
        borderRightColor: border,
        borderBottomColor: border,
        borderLeftColor: border,
      }}
    >
      <div className="flex flex-col items-start gap-2">
        <h3
          className="font-signature text-2xl leading-tight font-bold"
          style={{ color: textPrimary }}
        >
          {name}
        </h3>
        <Badge
          className="rounded-md border bg-transparent px-2.5 py-0.5 text-[9px] font-bold tracking-[0.2em]"
          style={{ borderColor: att.color, color: att.color }}
        >
          {att.label}
        </Badge>
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
