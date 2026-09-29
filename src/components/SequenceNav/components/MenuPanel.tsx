import { cn } from "@/lib/utils"
import PanelHeader from "./PanelHeader"
import SectionLinkItem from "./SectionLinkItem"
import StoryToggle from "./StoryToggle"
import { LINKS } from "../helper/menu"

interface MenuPanelProps {
  open: boolean
  tabbable: boolean
  activeId: string | null
  isPlaying: boolean
  onSelect: (id: string) => void
  onToggleStory: () => void
}

const MenuPanel = ({
  open,
  tabbable,
  activeId,
  isPlaying,
  onSelect,
  onToggleStory,
}: MenuPanelProps) => (
  <div
    id="sequence-menu"
    role="menu"
    aria-hidden={!open}
    className={cn(
      "absolute top-[calc(100%+12px)] right-0 w-[19rem] max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-[20px]",
      "border border-wedding-border-accent/60 bg-wedding-surface/92 shadow-wedding-card",
      "supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150",
      "transition-all duration-300 motion-reduce:transition-none",
      open
        ? "pointer-events-auto visible translate-y-0 scale-100 opacity-100"
        : "pointer-events-none invisible -translate-y-2 scale-[0.96] opacity-0"
    )}
  >
    {/* garis cahaya emas atas */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-wedding-accent/70 to-transparent"
    />

    <PanelHeader />

    <ul className="flex flex-col gap-1 px-3 pt-2 pb-2">
      {LINKS.map((link, i) => (
        <SectionLinkItem
          key={link.id}
          link={link}
          index={i}
          active={activeId === link.id}
          open={open}
          tabbable={tabbable}
          onSelect={onSelect}
        />
      ))}
    </ul>

    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-wedding-border-accent to-transparent" />

    <StoryToggle
      isPlaying={isPlaying}
      open={open}
      tabbable={tabbable}
      onToggle={onToggleStory}
    />

    <p className="px-6 pb-4 text-center font-serif text-[11px] tracking-[0.2em] text-wedding-text-secondary/70 uppercase">
      12 · 12 · 2026
    </p>

    <span className="sr-only">
      Our Story diputar otomatis dan berhenti di Waktu &amp; Tempat.
    </span>
  </div>
)

export default MenuPanel
