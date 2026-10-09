import { cn } from "@/lib/utils"

interface AttendanceToggleProps {
  value: "hadir" | "tidak_hadir" | "ragu"
  onChange: (v: "hadir" | "tidak_hadir" | "ragu") => void

  textSecondary?: string
  label?: string
  error?: string

  labelColor?: string
}

const ATTENDANCE = {
  hadir: { label: "Hadir", color: "#16A34A", bg: "#16A34A", text: "#fff" },
  ragu: { label: "Ragu", color: "#D4AF37", bg: "#dde0c2", text: "#111" },
  tidak_hadir: {
    label: "Tidak Hadir",
    color: "#EF4444",
    bg: "#9f0712",
    text: "#fff",
  },
} as const

export function AttendanceToggle({
  value,
  onChange,
  label,
  error,
}: AttendanceToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase text-wedding-text-secondary">
          {label}
        </label>
      )}
      <div
        role="radiogroup"
        aria-label={label ?? "Konfirmasi kehadiran"}
        className="flex gap-1 rounded-full border border-wedding-border bg-wedding-text-muted/10 p-1"
      >
        {(Object.keys(ATTENDANCE) as Array<keyof typeof ATTENDANCE>).map(
          (opt) => {
            const isActive = value === opt
            const style = ATTENDANCE[opt]
            return (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => onChange(opt)}
                className={cn(
                  "min-w-0 flex-1 cursor-pointer rounded-full px-1 py-2 font-sans text-[10px] font-bold tracking-[0.1em] whitespace-nowrap uppercase transition-all duration-200 md:py-2.5 md:text-[11px]",
                  !isActive &&
                    "bg-transparent text-wedding-text-secondary hover:text-wedding-text-primary"
                )}
                style={
                  isActive
                    ? {
                        color: style.text,
                        background: style.bg,
                        boxShadow: "0 4px 14px -4px rgba(0,0,0,0.4)",
                      }
                    : undefined
                }
              >
                {style.label}
              </button>
            )
          }
        )}
      </div>
      {error && (
        <span className="font-sans text-[10px]" style={{ color: "#EF4444" }}>
          {error}
        </span>
      )}
    </div>
  )
}
