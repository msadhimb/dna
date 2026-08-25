"use client"
import React, { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"

export interface WelcomeSectionRef {
  getTimeline: () => gsap.core.Timeline
}

export const WelcomeSection = forwardRef<
  WelcomeSectionRef,
  { guestName?: string }
>(({ guestName }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline()
      if (!containerRef.current || !textRef.current) return tl

      // Set awal: full visible
      gsap.set(containerRef.current, {
        opacity: 1,
        y: 0,
        force3D: true,
      })
      gsap.set(textRef.current, { y: 0, opacity: 1, force3D: true })

      // Animasi super ringan (pure composite: opacity & transform) namun tetap estetik
      tl.to(containerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: "none",
        force3D: true,
      })

      return tl
    },
  }))

  return (
    // Absolute overlay di dalam master-trigger — tidak ada pin terpisah,
    // tidak ada handoff antara dua ScrollTrigger = tidak ada hero glitch
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        ref={textRef}
        className="flex w-full max-w-screen-lg flex-col items-center justify-center px-4 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <p className="mb-5 font-serif text-[10px] font-semibold tracking-[0.55em] text-foreground/55 uppercase md:text-xs">
          {guestName ? "Kepada Tamu Kehormatan" : "You Are Invited"}
        </p>
        <h1 className="mb-5 max-w-[90vw] break-words font-serif text-4xl leading-tight font-semibold tracking-[0.03em] text-foreground md:max-w-4xl md:text-6xl">
          {guestName ? `Selamat Datang, ${guestName}` : "Welcome"}
        </h1>
        <p className="font-serif text-base font-medium tracking-[0.28em] text-foreground/65 uppercase md:text-xl md:tracking-[0.38em]">
          {guestName ? "Di Pernikahan Kami" : "To Our Wedding"}
        </p>
      </div>
    </div>
  )
})

WelcomeSection.displayName = "WelcomeSection"
