"use client"

import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface CurtainTransitionProps {
  frames: React.ReactNode[]
}

export function CurtainTransition({ frames }: CurtainTransitionProps) {
  const leftHalfRef = useRef<HTMLDivElement>(null)
  const rightHalfRef = useRef<HTMLDivElement>(null)

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

      {frames.map((frame, i) => (
        <div
          key={i}
          className={`photo-bg-${i} absolute inset-0 overflow-hidden`}
          style={{
            transform: "scale(0)",
            transformOrigin: "center center",
            zIndex: i + 1,
          }}
        >
          <div
            className={`photo-inner-${i}`}
            style={{
              position: "absolute",
              top: "-15%",
              left: "-15%",
              width: "130%",
              height: "130%",
              transform: "translateY(30%)",
            }}
          >
            {frame}
          </div>
        </div>
      ))}
    </div>
  )

  useEffect(() => {
    let tl: gsap.core.Timeline | null = null
    let interval: NodeJS.Timeout

    const initGSAP = () => {
      const heroSection = document.getElementById("hero-section")
      const leftHalf = leftHalfRef.current
      const rightHalf = rightHalfRef.current
      if (!heroSection || !leftHalf || !rightHalf) return false

      const STAGGER = 0.25
      const FRAME_DUR = 1.2
      const IMAGE_DUR = 0.75

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          pinSpacing: false,
        },
      })

      tl.to(".curtain-bg", {
        scaleX: 0.008,
        scaleY: 0.013,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.5,
      })
        .to(".curtain-bg", { scaleY: 1, duration: 0.7, ease: "power3.out" })
        .to(".curtain-bg", { scaleX: 1, duration: 0.6, ease: "expo.inOut" })

      frames.forEach((_, i) => {
        const pos = i === 0 ? "-=0.3" : `-=${FRAME_DUR - STAGGER}`
        tl!.to(
          `.photo-bg-${i}`,
          {
            scale: 1,
            duration: FRAME_DUR,
            ease: "power2.out",
          },
          pos
        )
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
      if (tl) {
        tl.scrollTrigger?.kill()
        tl.kill()
      }
    }
  }, [frames])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex">
      <div ref={leftHalfRef} className="relative h-full w-1/2 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-screen">
          {contentJSX}
        </div>
      </div>

      <div ref={rightHalfRef} className="relative h-full w-1/2 overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-screen">
          {contentJSX}
        </div>
      </div>
    </div>
  )
}
