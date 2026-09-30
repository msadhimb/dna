import HamburgerIcon from "@/components/Icons/HamburgerIcon"
import { cn } from "@/lib/utils"

interface MenuButtonProps {
  open: boolean
  visible: boolean
  onClick: () => void
}

const MenuButton = ({ open, visible, onClick }: MenuButtonProps) => {
  const label = open ? "Tutup navigasi" : "Buka navigasi"

  return (
    <button
      type="button"
      onClick={onClick}
      data-story-nav
      aria-expanded={open}
      aria-controls="sequence-menu"
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group flex h-10 w-10 cursor-pointer items-center justify-center gap-2 rounded-full",
        "border bg-white/50 dark:bg-black/50  p-2.5 text-muted dark:text-primary shadow-wedding-card",
        "supports-backdrop-filter:backdrop-blur-xl supports-backdrop-filter:backdrop-saturate-150",
        "transition-all duration-300 hover:-translate-y-px hover:border-wedding-accent/50 hover:shadow-lg active:translate-y-0 active:scale-[0.98]",
        "focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:outline-none",
        open && "border-wedding-accent/60"
      )}
    >
      <HamburgerIcon open={open} />
    </button>
  )
}

export default MenuButton
