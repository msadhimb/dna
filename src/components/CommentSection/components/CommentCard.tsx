import { AttendanceBadge } from "@/components/AttendanceBadge"
import { Card } from "@/components/Card"
import { Quote } from "lucide-react"

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

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export function CommentCard({
  name,
  message,
  attendance,
  date,
}: CommentCardProps) {
  return (
    <Card
      withTopLine={false}
      withCorners={false}
      shadow={false}
      className="cs-card-item gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-wedding-border-accent md:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wedding-accent/10 font-sans text-xs font-bold tracking-wider text-wedding-accent"
        >
          {initials(name)}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="truncate font-signature text-xl leading-tight font-bold text-wedding-text-primary">
            {name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <AttendanceBadge status={attendance} />
            <span className="font-sans text-[10px] tracking-wide text-wedding-text-muted">
              {date}
            </span>
          </div>
        </div>
        <Quote
          aria-hidden="true"
          className="h-4 w-4 shrink-0 rotate-180 text-wedding-accent/30"
        />
      </div>

      <p className="font-serif text-xs leading-relaxed text-wedding-text-secondary md:text-sm">
        {message}
      </p>
    </Card>
  )
}
