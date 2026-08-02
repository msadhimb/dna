interface AttendanceToggleProps {
  value: "hadir" | "tidak_hadir" | "ragu"
  onChange: (v: "hadir" | "tidak_hadir" | "ragu") => void
  textSecondary: string
  label?: string
  error?: string
  labelColor?: string
}

const ATTENDANCE = {
  hadir: { label: "HADIR", color: "#16A34A", bg: "#16A34A", text: "#fff" },
  ragu: { label: "RAGU", color: "#D4AF37", bg: "#D4AF37", text: "#111" },
  tidak_hadir: { label: "TIDAK HADIR", color: "#EF4444", bg: "#EF4444", text: "#fff" },
} as const

export function AttendanceToggle({ value, onChange, textSecondary, label, error, labelColor }: AttendanceToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-sans text-[10px] font-bold tracking-[0.35em] uppercase" style={{ color: labelColor }}>
          {label}
        </label>
      )}
      <div className="flex gap-2">
        {(Object.keys(ATTENDANCE) as Array<keyof typeof ATTENDANCE>).map((opt) => {
          const isActive = value === opt
          const style = ATTENDANCE[opt]
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex-1 rounded-lg border-2 py-2.5 font-sans text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-200"
              style={{
                borderColor: isActive ? style.color : "rgba(255,255,255,0.08)",
                color: isActive ? style.text : textSecondary,
                background: isActive ? style.bg : "transparent",
              }}
            >
              {style.label}
            </button>
          )
        })}
      </div>
      {error && (
        <span className="font-sans text-[10px]" style={{ color: "#EF4444" }}>
          {error}
        </span>
      )}
    </div>
  )
}
