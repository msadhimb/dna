"use client"

import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export const PREVIEW_FRAMES = [
  {
    light: "/asset/pre-wed/image/light/2.jpg",
    dark: "/asset/pre-wed/image/dark/2.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/3.jpg",
    dark: "/asset/pre-wed/image/dark/3.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/4.jpg",
    dark: "/asset/pre-wed/image/dark/4.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/5.jpg",
    dark: "/asset/pre-wed/image/dark/5.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/6.jpg",
    dark: "/asset/pre-wed/image/dark/6.jpg",
  },
]

interface CurtainTransitionProps {
  theme: "light" | "dark"
}

export function CurtainTransition({ theme }: CurtainTransitionProps) {
  const leftHalfRef = useRef<HTMLDivElement>(null)
  const rightHalfRef = useRef<HTMLDivElement>(null)

  // Tambahkan ref untuk frame-inner (gambar di dalam wrapper)
  const frameInnerRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null
    let interval: NodeJS.Timeout

    const initGSAP = () => {
      const heroSection = document.getElementById("hero-section")
      const leftHalf = leftHalfRef.current
      const rightHalf = rightHalfRef.current
      if (!heroSection || !leftHalf || !rightHalf) return false

      const STAGGER = 0.25
      const FRAME_DUR = 1.2 // frame: lambat
      const IMAGE_DUR = 0.75 // gambar: cepat

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=280%", // scroll distance lebih panjang
          scrub: 1,
          pin: true,
          pinSpacing: false,
        },
      })

      // Phase 1: dot → garis → full
      tl.to(".curtain-bg", {
        scaleX: 0.008,
        scaleY: 0.013,
        duration: 0.4,
        ease: "power2.in",
      })
        .to(".curtain-bg", { scaleY: 1, duration: 0.7, ease: "power3.out" })
        .to(".curtain-bg", { scaleX: 1, duration: 0.6, ease: "expo.inOut" })

      // Phase 2: setiap frame muncul, gambar parallax dari bawah

      PREVIEW_FRAMES.forEach((_, i) => {
        const isLast = i === PREVIEW_FRAMES.length - 1
        const pos = i === 0 ? "-=0.3" : `-=${FRAME_DUR - STAGGER}`

        // Frame (container) scale-up — lambat
        tl!.to(
          `.photo-bg-${i}`,
          {
            scale: 1,
            duration: FRAME_DUR,
            ease: isLast ? "back.out(1.06)" : "power2.out",
          },
          pos
        )

        // Gambar translateY → 0 — lebih cepat, mulai bersamaan
        tl!.to(
          `.photo-inner-${i}`,
          {
            y: "0%",
            duration: IMAGE_DUR,
            ease: "power3.out",
          },
          "<"
        )
      })

      tl.set(heroSection, { opacity: 0 })
      tl.to({}, { duration: 0.5 })

      // Phase 3: curtain split
      tl.to(
        leftHalf,
        { xPercent: -100, duration: 1.1, ease: "expo.inOut" },
        "split"
      )
      tl.to(
        rightHalf,
        { xPercent: 100, duration: 1.1, ease: "expo.inOut" },
        "split"
      )

      return true
    }

    if (!initGSAP()) {
      interval = setInterval(() => {
        if (initGSAP()) clearInterval(interval)
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
      tl?.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  const contentJSX = (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <div
        className="curtain-bg absolute inset-0 bg-primary"
        style={{
          transform: "scale(0)",
          transformOrigin: "center center",
          zIndex: 0,
        }}
      />

      {PREVIEW_FRAMES.map((frame, i) => (
        <div
          key={i}
          className={`photo-bg-${i} absolute inset-0 overflow-hidden`}
          style={{
            transform: "scale(0)",
            transformOrigin: "center center",
            zIndex: i + 1,
          }}
        >
          {/* Layer gambar — oversized, akan bergerak lebih cepat dari frame */}
          <div
            className={`photo-inner-${i}`}
            style={{
              position: "absolute",
              top: "-15%",
              left: "-15%",
              width: "130%", // ← eksplisit, bukan right/bottom
              height: "130%", // ← eksplisit
              transform: "translateY(30%)",
            }}
          >
            <Image
              src={theme === "dark" ? frame.dark : frame.light}
              alt={`Curtain Photo ${i + 1}`}
              fill
              sizes="130vw"
              priority={i === 0} // ← priority hanya frame pertama
              className="object-cover object-center"
            />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex">
      {/* Left Half Panel */}
      <div ref={leftHalfRef} className="relative h-full w-1/2 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-[100vw]">
          {contentJSX}
        </div>
      </div>

      {/* Right Half Panel */}
      <div ref={rightHalfRef} className="relative h-full w-1/2 overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-[100vw]">
          {contentJSX}
        </div>
      </div>
    </div>
  )
}
