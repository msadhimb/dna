import { cn } from "@/lib/utils"
import { Pause, Play } from "lucide-react"

interface StoryToggleProps {
  isPlaying: boolean
  open: boolean
  tabbable: boolean
  onToggle: () => void
}

const StoryToggle = ({
  isPlaying,
  open,
  tabbable,
  onToggle,
}: StoryToggleProps) => (
  <div
    style={{ transitionDelay: open ? "260ms" : "0ms" }}
    className={cn(
      "p-3 transition-all duration-300",
      open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
    )}
  >
    <button
      type="button"
      role="menuitemcheckbox"
      onClick={onToggle}
      data-story-nav
      aria-checked={isPlaying}
      tabIndex={tabbable ? 0 : -1}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:outline-none",
        isPlaying
          ? "border-wedding-accent/50 bg-wedding-accent/[0.12]"
          : "border-dashed border-wedding-border-accent/70 hover:border-wedding-accent/50 hover:bg-wedding-accent/[0.06]"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
          isPlaying
            ? "bg-wedding-accent text-white shadow-md"
            : "bg-wedding-accent/12 text-wedding-accent"
        )}
      >
        {isPlaying ? (
          <Pause strokeWidth={2} className="h-4 w-4" />
        ) : (
          <Play strokeWidth={2} className="ml-0.5 h-4 w-4" />
        )}
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-serif text-[16px] leading-snug font-medium text-wedding-text-primary">
          {isPlaying ? "Hentikan Story" : "Putar Our Story"}
        </span>
        <span className="mt-0.5 font-serif text-[12.5px] leading-relaxed text-wedding-text-secondary italic">
          Gulir perlahan s.d. Waktu &amp; Tempat
        </span>
      </span>

      {isPlaying && (
        <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
          <span className="h-1 w-1 animate-pulse rounded-full bg-wedding-accent" />
          <span className="h-1 w-1 animate-pulse rounded-full bg-wedding-accent [animation-delay:150ms]" />
          <span className="h-1 w-1 animate-pulse rounded-full bg-wedding-accent [animation-delay:300ms]" />
        </span>
      )}
    </button>
  </div>
)

export default StoryToggle
