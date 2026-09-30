import { cn } from "@/lib/utils"

const HamburgerIcon = ({ open }: { open: boolean }) => {
  const line =
    "absolute left-0 h-[2px] w-full bg-current transition-all duration-300"

  return (
    <span className="relative block h-[12px] w-[18px]" aria-hidden="true">
      <span
        className={cn(
          line,
          open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
        )}
      />
      <span
        className={cn(
          line,
          "top-1/2 -translate-y-1/2",
          open && "scale-x-0 opacity-0"
        )}
      />
      <span
        className={cn(
          line,
          open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
        )}
      />
    </span>
  )
}

export default HamburgerIcon
