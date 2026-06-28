"use client"

import React, { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"

interface CurtainTransitionProps {
  frames: React.ReactNode[]
}

export interface CurtainTransitionRef {
  getTimeline: () => gsap.core.Timeline
}

export const CurtainTransition = forwardRef<
  CurtainTransitionRef,
  CurtainTransitionProps
>(({ frames }, ref) => {
  const leftHalfRef = useRef<HTMLDivElement>(null)
  const rightHalfRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline()
      const STAGGER = 0.25
      const FRAME_DUR = 1.2
      const IMAGE_DUR = 0.75
      const heroSection = document.getElementById("hero-section")
      const journeyWrapper = document.getElementById("journey-wrapper")

      // Curtain muncul: titik kecil → garis vertikal → melebar penuh
      tl.to(".curtain-bg", {
        scaleX: 0.008,
        scaleY: 0.013,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.5,
      })
        .to(".curtain-bg", { scaleY: 1, duration: 0.7, ease: "power3.out" })
        .to(".curtain-bg", { scaleX: 1, duration: 0.6, ease: "expo.inOut" })

      // Frame photos slideIn satu per satu
      frames.forEach((_, i) => {
        const pos = i === 0 ? "-=0.3" : `-=${FRAME_DUR - STAGGER}`
        tl.to(
          `.photo-bg-${i}`,
          { scale: 1, duration: FRAME_DUR, ease: "power2.out" },
          pos
        ).to(
          `.photo-inner-${i}`,
          { y: "0%", duration: IMAGE_DUR, ease: "power3.out" },
          "<"
        )
      })

      // Fade hero halus sebelum split
      if (heroSection) {
        tl.to(heroSection, { opacity: 0, duration: 0.25, ease: "power1.inOut" }).to(
          {},
          { duration: 0.5 }
        )
      }

      // Prepare Journey Sequence underneath the split
      if (journeyWrapper) {
        tl.set(journeyWrapper, { opacity: 1, pointerEvents: "auto" })
      }

      // Split curtain kiri dan kanan
      if (leftHalfRef.current && rightHalfRef.current) {
        tl.to(
          leftHalfRef.current,
          { xPercent: -100, duration: 1.1, ease: "expo.inOut", force3D: true },
          "split"
        ).to(
          rightHalfRef.current,
          { xPercent: 100, duration: 1.1, ease: "expo.inOut", force3D: true },
          "split"
        )
      }

      return tl
    },
  }))

  const contentJSX = (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
      <div
        className="curtain-bg absolute inset-0 bg-primary"
        style={{
          transform: "scale(0.001)",
          transformOrigin: "center center",
          zIndex: 0,
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      />

      {frames.map((frame, i) => (
        <div
          key={i}
          className={`photo-bg-${i} absolute inset-0 overflow-hidden`}
          style={{
            transform: "scale(0.001)",
            transformOrigin: "center center",
            zIndex: i + 1,
            willChange: "transform",
            backfaceVisibility: "hidden",
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
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            {frame}
          </div>
        </div>
      ))}
    </div>
  )

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
})

CurtainTransition.displayName = "CurtainTransition"
