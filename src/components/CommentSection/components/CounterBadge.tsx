interface CounterBadgeProps {
  count: number

  borderAccent?: string

  textSecondary?: string
}

export function CounterBadge({ count }: CounterBadgeProps) {
  return (
    <div className="cs-count flex flex-col items-center gap-5">
      <div className="flex w-full max-w-xs items-center gap-3">
        <div className="h-px flex-1 bg-wedding-border-accent" />
        <span className="flex items-center gap-2 rounded-full border border-wedding-border-accent bg-wedding-accent/10 px-4 py-1.5 font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-wedding-text-secondary">
          <span className="text-xs font-bold tracking-normal text-wedding-accent">
            {count}
          </span>
          Ucapan
        </span>
        <div className="h-px flex-1 bg-wedding-border-accent" />
      </div>
    </div>
  )
}
