import { cn } from "@/lib/utils"

const HamburgerIcon = ({ open }: { open: boolean }) => {
  const line =
    "absolute top-1/3 left-0 h-[2px] w-full bg-current transition-all duration-300"

  return (
    <span className="relative block h-auto w-[18px]" aria-hidden="true">
      <span className={cn(line, open ? "rotate-45" : "-translate-y-[5px]")} />
      <span className={cn(line, open && "scale-x-0 opacity-0")} />
      <span className={cn(line, open ? "-rotate-45" : "translate-y-[5px]")} />
    </span>
  )
}

export default HamburgerIcon
