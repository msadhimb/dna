interface CounterBadgeProps {
  count: number
  /** @deprecated — terpusat via Tailwind */
  borderAccent?: string
  /** @deprecated */
  textSecondary?: string
}

export function CounterBadge({ count }: CounterBadgeProps) {
  return (
    <div className="cs-count flex flex-col items-center gap-5">
      <div className="flex w-full max-w-xs items-center gap-4">
        <div className="h-px flex-1 bg-wedding-border-accent" />
        <span className="font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-wedding-text-secondary">
          {count} Ucapan
        </span>
        <div className="h-px flex-1 bg-wedding-border-accent" />
      </div>
    </div>
  )
}
