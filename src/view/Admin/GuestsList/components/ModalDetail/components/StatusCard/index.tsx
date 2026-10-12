import { cn } from "@/lib/utils"
import { StatusDot } from "@/view/Admin/GuestsList/tables/columns"

const StatusCard = ({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode
  label: string
  value: string
  ok: boolean
}) => (
  <div
    className={cn(
      "flex min-w-0 items-center gap-2 rounded-2xl border p-2.5 sm:gap-3 sm:px-3 sm:py-3",
      ok
        ? "border-emerald-500/25 bg-emerald-500/[0.07]"
        : "border-border/70 bg-card/50"
    )}
  >
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border sm:size-9",
        ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
          : "border-border bg-muted/20 text-muted-foreground"
      )}
    >
      {icon}
    </span>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold tracking-[0.14em] text-muted-foreground uppercase sm:text-[11px]">
        {label}
      </p>
      <p className="truncate text-[13px] font-semibold text-foreground sm:text-sm">
        {value}
      </p>
    </div>
    <StatusDot ok={ok} />
  </div>
)

export default StatusCard
