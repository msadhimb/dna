import { cn } from "@/lib/utils"
import { NavLink } from "../helper/menu"

interface SectionLinkItemProps {
  link: NavLink
  index: number
  active: boolean
  open: boolean
  tabbable: boolean
  onSelect: (id: string) => void
}

const SectionLinkItem = ({
  link,
  index,
  active,
  open,
  tabbable,
  onSelect,
}: SectionLinkItemProps) => {
  const { id, no, label, hint, Icon } = link

  return (
    <li
      style={{ transitionDelay: open ? `${80 + index * 55}ms` : "0ms" }}
      className={cn(
        "transition-all duration-300",
        open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <button
        type="button"
        role="menuitem"
        onClick={() => onSelect(id)}
        data-story-nav
        aria-current={active ? "location" : undefined}
        tabIndex={tabbable ? 0 : -1}
        className={cn(
          "group relative flex w-full cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl px-4 py-3 text-left transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:outline-none",
          active
            ? "bg-gradient-to-r from-wedding-accent/[0.16] via-wedding-accent/[0.08] to-transparent"
            : "hover:bg-wedding-text-primary/[0.045]"
        )}
      >
        {/* penanda aktif */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-1/2 left-0 h-8 w-[2.5px] -translate-y-1/2 rounded-full bg-wedding-accent transition-all duration-300",
            active ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          )}
        />

        {/* ikon */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
            active
              ? "border-wedding-accent/50 bg-wedding-accent/12 text-wedding-accent"
              : "border-wedding-border text-wedding-text-secondary group-hover:border-wedding-accent/40 group-hover:text-wedding-accent"
          )}
        >
          <Icon strokeWidth={1.75} className="h-[18px] w-[18px]" />
        </span>

        {/* teks */}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-baseline gap-2">
            <span className="truncate font-serif text-[16px] leading-snug font-medium text-wedding-text-primary">
              {label}
            </span>
          </span>
          <span className="mt-0.5 truncate font-serif text-[12.5px] leading-relaxed text-wedding-text-secondary italic">
            {hint}
          </span>
        </span>

        {/* chevron */}
        <span
          aria-hidden="true"
          className={cn(
            "font-serif text-lg transition-all duration-200",
            active
              ? "translate-x-0 text-wedding-accent opacity-100"
              : "-translate-x-1 text-wedding-text-secondary opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
          )}
        >
          ›
        </span>
      </button>
    </li>
  )
}

export default SectionLinkItem
