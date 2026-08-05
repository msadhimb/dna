import { cn } from "@/lib/utils"

interface AttendanceToggleProps {
  value: "hadir" | "tidak_hadir" | "ragu"
  onChange: (v: "hadir" | "tidak_hadir" | "ragu") => void
  textSecondary: string
  label?: string
  error?: string
  labelColor?: string
}

const ATTENDANCE = {
  hadir: { label: "HADIR", color: "#16A34A", bg: "#016630", text: "#fff" },
  ragu: { label: "RAGU", color: "#D4AF37", bg: "#E6B432", text: "#111" },
  tidak_hadir: {
    label: "TIDAK HADIR",
    color: "#EF4444",
    bg: "#9f0712",
    text: "#fff",
  },
} as const

export function AttendanceToggle({
  value,
  onChange,
  textSecondary,
  label,
  error,
  labelColor,
}: AttendanceToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase"
          style={{ color: labelColor }}
        >
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {(Object.keys(ATTENDANCE) as Array<keyof typeof ATTENDANCE>).map(
          (opt) => {
            const isActive = value === opt
            const style = ATTENDANCE[opt]
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                className={cn(
                  "flex-1 rounded-lg border-2 py-3.5 font-sans text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-200",
                  isActive
                    ? `border-[${style.color}]`
                    : "dark:border-[#4e4e4eee] border-[#979797ee]"
                )}
                style={{
                  color: isActive ? style.text : textSecondary,
                  background: isActive ? style.bg : "transparent",
                }}
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
