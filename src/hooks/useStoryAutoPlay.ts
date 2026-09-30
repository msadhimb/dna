"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  STORY_START_ID,
  getSectionY,
  scrollToSection,
} from "@/components/SequenceNav/helper/scrollToSection"

interface UseStoryAutoPlayOptions {

  targetId?: string

  speed?: number

  topOffset?: number
}

const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
])

export function useStoryAutoPlay({
  targetId = "time-and-place",
  speed = 150,
  topOffset = 72,
}: UseStoryAutoPlayOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const rewindRafRef = useRef<number | null>(null)
  const runIdRef = useRef(0)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const stop = useCallback(() => {
    runIdRef.current += 1
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (rewindRafRef.current !== null) {
      cancelAnimationFrame(rewindRafRef.current)
      rewindRafRef.current = null
    }
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    lastTsRef.current = null
    setIsPlaying(false)
  }, [])

  const start = useCallback(() => {
    if (typeof window === "undefined") return
    if (
      rafRef.current !== null ||
      timeoutRef.current !== null ||
      rewindRafRef.current !== null
    )
      return

    const target = document.getElementById(targetId)
    if (!target) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView({ block: "start" })
      return
    }

    const runId = runIdRef.current + 1
    runIdRef.current = runId
    const alive = () => runIdRef.current === runId

    const step = (ts: number) => {
      if (!alive()) return
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1)
      lastTsRef.current = ts

      window.scrollBy(0, speedRef.current * dt)

      const el = document.getElementById(targetId)
      if (!el) {
        stop()
        return
      }

      if (el.getBoundingClientRect().top <= topOffset + 8) {

        const y = getSectionY(targetId) ?? window.scrollY
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" })
        stop()
        return
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= maxScroll - 2) {
        stop()
        return
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const begin = () => {
      if (!alive()) return
      timeoutRef.current = null
      lastTsRef.current = null
      setIsPlaying(true)
      rafRef.current = requestAnimationFrame(step)
    }

    const startY = getSectionY(STORY_START_ID) ?? 0
    const atStart = Math.abs(window.scrollY - startY) <= 4
    if (!atStart) {
      setIsPlaying(true)
      scrollToSection(STORY_START_ID, "smooth")
      const deadline = performance.now() + 4000
      const poll = () => {
        if (!alive()) return
        const near = Math.abs(window.scrollY - startY) <= 8
        if (near || performance.now() >= deadline) {
          rewindRafRef.current = null

          window.scrollTo({ top: startY, behavior: "auto" })
          timeoutRef.current = window.setTimeout(begin, 200)
          return
        }
        rewindRafRef.current = requestAnimationFrame(poll)
      }
      rewindRafRef.current = requestAnimationFrame(poll)
      return
    }

    begin()
  }, [targetId, topOffset, stop])

  const toggle = useCallback(() => {
    if (
      rafRef.current !== null ||
      timeoutRef.current !== null ||
      rewindRafRef.current !== null
    )
      stop()
    else start()
  }, [start, stop])

  useEffect(() => {
    if (!isPlaying) return

    const fromNav = (e: Event) =>
      (e.target as HTMLElement | null)?.closest?.("[data-story-nav]") != null

    const onWheel = (e: WheelEvent) => {
      if (fromNav(e)) return
      stop()
    }
    const onTouch = (e: TouchEvent) => {
      if (fromNav(e)) return
      stop()
    }
    const onKey = (e: KeyboardEvent) => {
      if (fromNav(e)) return
      if (SCROLL_KEYS.has(e.key)) stop()
    }

    window.addEventListener("wheel", onWheel, { passive: true })
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("keydown", onKey)
    }
  }, [isPlaying, stop])

  useEffect(() => () => stop(), [stop])

  return { isPlaying, start, stop, toggle }
}

export default useStoryAutoPlay
