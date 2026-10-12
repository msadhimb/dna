import { cn } from "@/lib/utils"
import { Clock3 } from "lucide-react"
import { fmtTime } from "../../helper/fmtTime"

const CheckInRow = ({
  label,
  iso,
  highlight,
}: {
  label: string
  iso: string | null | undefined
  highlight: boolean
}) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-xl border px-3 py-2.5",
      highlight
        ? "border-emerald-500/25 bg-emerald-500/[0.07]"
        : "border-border/60 bg-card/40"
    )}
  >
    <Clock3
      className={cn(
        "size-4 shrink-0",
        highlight ? "text-emerald-600" : "text-muted-foreground"
      )}
    />
    <span className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
      {label}
    </span>
    <span
      className={cn(
        "ml-auto shrink-0 text-right text-xs font-semibold sm:text-[13px]",
        highlight
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-muted-foreground"
      )}
    >
      {fmtTime(iso)}
    </span>
  </div>
)

export default CheckInRow
