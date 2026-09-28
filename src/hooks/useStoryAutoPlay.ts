"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface UseStoryAutoPlayOptions {
  /** Id elemen tempat autoplay berhenti. Default: time-and-place. */
  targetId?: string
  /** Kecepatan gulir px/detik. Default 150 — selaras dengan mode baca pelan. */
  speed?: number
  /** Jarak top viewport saat dianggap sampai (px). */
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

/**
 * Autoplay "Our Story": menggulir halaman perlahan dari posisi saat ini
 * (atau dari awal pinned story bila sudah lewat) dan BERHENTI tepat di
 * TimeAndPlace — tidak lanjut ke footer. Berhenti juga saat pengguna
 * mengambil alih (wheel / sentuh / keyboard).
 */
export function useStoryAutoPlay({
  targetId = "time-and-place",
  speed = 150,
  topOffset = 72,
}: UseStoryAutoPlayOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
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
    if (rafRef.current !== null || timeoutRef.current !== null) return

    const target = document.getElementById(targetId)
    if (!target) return

    // Reduced motion: langsung lompat tanpa animasi gulir.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      target.scrollIntoView({ block: "start" })
      return
    }

    const step = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1)
      lastTsRef.current = ts

      window.scrollBy(0, speedRef.current * dt)

      const el = document.getElementById(targetId)
      if (!el) {
        stop()
        return
      }
      // Sampai: top TimeAndPlace sudah dekat top viewport → berhenti.
      // Sengaja TIDAK lanjut ke Comment / Gift / Footer.
      if (el.getBoundingClientRect().top <= topOffset + 8) {
        // Parkir presisi di bawah offset agar judul tidak tertutup nav.
        const y =
          window.scrollY + el.getBoundingClientRect().top - topOffset
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
      timeoutRef.current = null
      lastTsRef.current = null
      setIsPlaying(true)
      rafRef.current = requestAnimationFrame(step)
    }

    const rect = target.getBoundingClientRect()
    const alreadyPast = rect.top < window.innerHeight * 0.3
    if (alreadyPast) {
      // Sudah lewat TimeAndPlace: putar ulang dari awal pinned story,
      // lalu jalan perlahan sampai TimeAndPlace dan berhenti di sana.
      const master = document.getElementById("master-trigger")
      if (master) master.scrollIntoView({ behavior: "smooth", block: "start" })
      else window.scrollTo({ top: 0, behavior: "smooth" })
      timeoutRef.current = window.setTimeout(begin, 750)
    } else {
      begin()
    }
  }, [targetId, topOffset, stop])

  const toggle = useCallback(() => {
    if (rafRef.current !== null || timeoutRef.current !== null) stop()
    else start()
  }, [start, stop])

  // Interupsi pengguna menghentikan autoplay — kecuali dari nav itu sendiri.
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
