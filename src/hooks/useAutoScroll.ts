"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseAutoScrollOptions {
  /** Kecepatan gulir dalam px/detik. Default 140 — santai tapi tetap jalan. */
  speed?: number
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

/**
 * Penggulir otomatis yang pelan untuk mode baca hands-free.
 * Berbasis requestAnimationFrame + delta waktu sehingga kecepatannya
 * konstan di semua refresh rate, kompatibel dengan ScrollTrigger scrub
 * (hanya menggeser window.scrollY), dan langsung berhenti saat
 * pengguna mengambil alih (wheel / sentuh / tombol keyboard).
 */
export function useAutoScroll({ speed = 140 }: UseAutoScrollOptions = {}) {
  const [isActive, setIsActive] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastTsRef.current = null
    setIsActive(false)
  }, [])

  const start = useCallback(() => {
    if (typeof window === "undefined") return
    if (rafRef.current !== null) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    setIsActive(true)

    const step = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1)
      lastTsRef.current = ts

      window.scrollBy(0, speedRef.current * dt)

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= maxScroll - 2) {
        stop()
        return
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
  }, [stop])

  const toggle = useCallback(() => {
    if (rafRef.current !== null) stop()
    else start()
  }, [start, stop])

  // Interupsi pengguna menghentikan gulir otomatis — kecuali interaksi
  // itu berasal dari tombol toggle itu sendiri (ditandai data-attr).
  useEffect(() => {
    if (!isActive) return

    const fromToggle = (e: Event) =>
      (e.target as HTMLElement | null)?.closest?.(
        "[data-autoscroll-toggle]"
      ) != null

    const onWheel = (e: WheelEvent) => {
      if (fromToggle(e)) return
      stop()
    }
    const onTouch = (e: TouchEvent) => {
      if (fromToggle(e)) return
      stop()
    }
    const onKey = (e: KeyboardEvent) => {
      if (fromToggle(e)) return
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
  }, [isActive, stop])

  useEffect(() => () => stop(), [stop])

  return { isActive, start, stop, toggle }
}

export default useAutoScroll
