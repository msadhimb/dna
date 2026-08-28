"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface ScrollState {
  scrollY: number
  scrollX: number
  direction: "up" | "down" | null
  progress: number // 0 - 1, terhadap total scrollable height
  isScrolling: boolean
}

interface UseScrollOptions {
  /** Throttle via requestAnimationFrame (default: true) */
  throttle?: boolean
  /** Delay (ms) sebelum isScrolling dianggap berhenti (default: 150) */
  idleDelay?: number
}

export function useScroll(options: UseScrollOptions = {}): ScrollState {
  const { throttle = true, idleDelay = 150 } = options

  const [state, setState] = useState<ScrollState>({
    scrollY: 0,
    scrollX: 0,
    direction: null,
    progress: 0,
    isScrolling: false,
  })

  const lastScrollY = useRef(0)
  const tickingRef = useRef(false)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateScrollState = useCallback(() => {
    const scrollY = window.scrollY
    const scrollX = window.scrollX
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight

    const direction =
      scrollY > lastScrollY.current
        ? "down"
        : scrollY < lastScrollY.current
          ? "up"
          : null

    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0

    lastScrollY.current = scrollY

    setState({
      scrollY,
      scrollX,
      direction,
      progress,
      isScrolling: true,
    })

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isScrolling: false }))
    }, idleDelay)

    tickingRef.current = false
  }, [idleDelay])

  useEffect(() => {
    const handleScroll = () => {
      if (throttle) {
        if (!tickingRef.current) {
          tickingRef.current = true
          requestAnimationFrame(updateScrollState)
        }
      } else {
        updateScrollState()
      }
    }

    // Set nilai awal
    lastScrollY.current = window.scrollY

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [throttle, updateScrollState])

  return state
}

export default useScroll
