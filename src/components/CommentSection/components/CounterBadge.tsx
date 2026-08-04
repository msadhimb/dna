interface CounterBadgeProps {
  count: number
  borderAccent: string
  textSecondary: string
}

export function CounterBadge({
  count,
  borderAccent,
  textSecondary,
}: CounterBadgeProps) {
  return (
    <div className="cs-count flex flex-col items-center gap-5">
      <div className="flex w-full max-w-xs items-center gap-4">
        <div className="h-px flex-1" style={{ background: borderAccent }} />
        <span
          className="font-sans text-[10px] font-bold tracking-[0.4em] uppercase"
          style={{ color: textSecondary }}
        >
          {count} Ucapan
        </span>
        <div className="h-px flex-1" style={{ background: borderAccent }} />
      </div>
    </div>
  )
}
