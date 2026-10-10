"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useStoryAutoPlay } from "@/hooks/useStoryAutoPlay"
import { LINKS } from "../SequenceNav/helper/menu"
import { scrollToSection } from "../SequenceNav/helper/scrollToSection"
import MenuButton from "../SequenceNav/components/MenuButton"
import MenuPanel from "../SequenceNav/components/MenuPanel"
import { useActiveSection } from "../SequenceNav/hook/useActiveSection"
import { useEntranceAnimation } from "../SequenceNav/hook/useEntranceAnimation"
import { useDismiss } from "../SequenceNav/hook/useDismiss"

export const SequenceNav = ({ visible = true }: { visible?: boolean }) => {
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  const SECTION_IDS = useMemo(() => LINKS.map((l) => l.id), [])

  const activeId = useActiveSection(SECTION_IDS)
  const { isPlaying, toggle } = useStoryAutoPlay({
    targetId: "time-and-place",
    speed: 250, // sedikit lebih cepat
  })
  const shown = visible

  const close = useCallback(() => setOpen(false), [])
  const toggleOpen = useCallback(() => setOpen((v) => !v), [])

  useEntranceAnimation(navRef, shown)
  useDismiss(navRef, open, close)

  useEffect(() => {
    if (!shown) setOpen(false)
  }, [shown])

  const handleSelect = useCallback((id: string) => {
    setOpen(false)

    requestAnimationFrame(() => scrollToSection(id))
  }, [])

  const handleToggleStory = useCallback(() => {
    toggle()
    setOpen(false)
  }, [toggle])

  const tabbable = open && shown

  return (
    <div
      aria-hidden={!shown}
      className={cn(
        "pointer-events-none fixed inset-0 z-30 transition-opacity duration-500",
        shown ? "opacity-100" : "opacity-0"
      )}
      style={{ top: "max(0rem, env(safe-area-inset-top, 0px))" }}
    >
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300",
          open && shown ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <div className="absolute inset-x-0 top-0 flex justify-end pt-4 pr-4 sm:pt-5 sm:pr-6">
        <nav
          ref={navRef}
          data-story-nav
          aria-label="Navigasi undangan"
          className={cn(!shown && "pointer-events-none invisible")}
        >
          <div className="pointer-events-auto relative">
            <MenuButton open={open} visible={shown} onClick={toggleOpen} />
            <MenuPanel
              open={open}
              tabbable={tabbable}
              activeId={activeId}
              isPlaying={isPlaying}
              onSelect={handleSelect}
              onToggleStory={handleToggleStory}
            />
          </div>
        </nav>
      </div>
    </div>
  )
}

export default SequenceNav
