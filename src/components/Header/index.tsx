import { cn } from "@/lib/utils"
import React, { memo } from "react"

const Header = memo(function Header({
  id,
  subHeader,
  title,
  subTitle,
  className,
  classNameTitle,
  classNameSubTitle,
  spaceY = 0,
  separator,
}: {
  id?: string
  subHeader: string
  title: string
  subTitle: string
  className?: string
  classNameTitle?: string
  classNameSubTitle?: string
  spaceY?: number
  separator?: any
}) {
  return (
    <div
      id={id}
      className={cn(
        "relative z-10 flex shrink-0 flex-col items-center gap-3 text-center md:gap-4 md:px-10",
        className
      )}
      // Isolasi paint agar animasi opacity parent tidak memicu repaint global.
      // Penting saat Header dipakai di dalam pinned scrub (BioSequence).
      style={{ contain: "layout style" }}
    >
      <p className="font-sans text-[10px] font-semibold tracking-[0.5em] uppercase">
        {subHeader}
      </p>
      {/* spaceY via inline style: `space-y-${spaceY}` dinamis tidak di-generate Tailwind */}
      <div
        className="flex flex-col items-center"
        style={{ rowGap: `${spaceY * 0.25}rem` }}
      >
        <h2
          className={cn(
            "font-signature leading-none font-bold text-5xl md:text-7xl",
            classNameTitle
          )}
        >
          {title}
        </h2>
        {separator}
        <p
          className={cn(
            "max-w-[90%] font-serif text-sm leading-relaxed md:text-[13px]",
            classNameSubTitle
          )}
        >
          {subTitle}
        </p>
      </div>
    </div>
  )
})

export default Header
