"use client"

import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react"
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

      tl.set(heroSection, {
        opacity: 1,
      })
      tl.set(leftHalfRef.current, {
        xPercent: 0,
        x: 0,
        z: 0.01,
        force3D: true,
      })

      tl.set(rightHalfRef.current, {
        xPercent: 0,
        x: 0,
        z: 0.01,
        force3D: true,
      })

      tl.set(".curtain-bg", {
        scaleX: 0.001,
        scaleY: 0.001,
        force3D: true,
        z: 0.01,
      })

      frames.forEach((_, i) => {
        tl.set(`.photo-bg-${i}`, {
          scale: 0.001,
          force3D: true,
          z: 0.01,
        })

        tl.set(`.photo-inner-${i}`, {
          y: "30%",
          force3D: true,
          z: 0.01,
        })
      })

      
      
      // Curtain muncul: titik kecil → garis vertikal → melebar penuh
      // Gunakan keyframes agar transisi antar fase mulus tanpa discontinuity
      tl.to(
        ".curtain-bg",
        {
          keyframes: [
            { scaleX: 0.008, scaleY: 0.013, duration: 0.4, ease: "power2.in" },
            { scaleY: 1, duration: 0.7, ease: "power3.out" },
            { scaleX: 1, duration: 0.6, ease: "expo.inOut" },
          ],
          force3D: true,
        },
        ">0.5"
      )

      
      // Frame photos slideIn satu per satu
      frames.forEach((_, i) => {
        const pos = i === 0 ? "-=0.3" : `-=${FRAME_DUR - STAGGER}`
        tl.to(
          `.photo-bg-${i}`,
          { scale: 1, duration: FRAME_DUR, ease: "power2.out", force3D: true },
          pos
        ).to(
          `.photo-inner-${i}`,
          { y: "0%", duration: IMAGE_DUR, ease: "power3.out", force3D: true },
          "<"
        )
      })

      
      // Fade hero halus sebelum split
      tl.to(
        heroSection,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power1.inOut",
        },
        "heroFade"
      ).to(journeyWrapper, { opacity: 1, pointerEvents: "auto" }, "heroFade")

      // Split curtain kiri dan kanan — diperlambat agar smooth, ease tetap expo.inOut
      if (leftHalfRef.current && rightHalfRef.current) {
        tl.set([leftHalfRef.current, rightHalfRef.current], {
          willChange: "transform",
          force3D: true,
          z: 0.01,
        })
        tl.to(
          leftHalfRef.current,
          { xPercent: -100, duration: 1.6, ease: "expo.inOut", force3D: true, z: 0.01 },
          "split"
        ).to(
          rightHalfRef.current,
          { xPercent: 100, duration: 1.6, ease: "expo.inOut", force3D: true, z: 0.01 },
          "split"
        )
      }

      return tl
    },
  }))

  const contentJSX = (
    <div
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
      style={{ contain: "paint" }}
    >
      <div
        className="curtain-bg absolute inset-0 bg-primary"
        style={{
          transform: "translateZ(0) scale(0.001)",
          transformOrigin: "center center",
          zIndex: 0,
          willChange: "transform",
          backfaceVisibility: "hidden",
          contain: "paint",
        }}
      />

      {frames.map((frame, i) => (
        <div
          key={i}
          className={`photo-bg-${i} absolute inset-0 overflow-hidden`}
          style={{
            transform: "translateZ(0) scale(0.001)",
            transformOrigin: "center center",
            zIndex: i + 1,
            willChange: "transform",
            backfaceVisibility: "hidden",
            contain: "paint",
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
              transform: "translate3d(0,30%,0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
              contain: "paint",
            }}
          >
            {frame}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 flex"
      style={{ contain: "paint" }}
    >
      <div
        ref={leftHalfRef}
        className="relative h-full w-1/2 overflow-hidden"
        style={{
          willChange: "transform",
          contain: "paint",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          className="absolute top-0 left-0 h-full w-screen"
          style={{ contain: "paint", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {contentJSX}
        </div>
      </div>

      <div
        ref={rightHalfRef}
        className="relative h-full w-1/2 overflow-hidden"
        style={{
          willChange: "transform",
          contain: "paint",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          className="absolute top-0 right-0 h-full w-screen"
          style={{ contain: "paint", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
        >
          {contentJSX}
        </div>
      </div>
    </div>
  )
})

CurtainTransition.displayName = "CurtainTransition"
