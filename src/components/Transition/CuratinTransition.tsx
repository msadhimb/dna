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
  const mmCleanupRef = useRef<(() => void) | null>(null)

  // Clean up matchMedia on unmount
  React.useEffect(() => {
    return () => {
      if (mmCleanupRef.current) {
        mmCleanupRef.current()
        mmCleanupRef.current = null
      }
    }
  }, [])

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline()
      const heroSection = document.getElementById("hero-section")
      const journeyWrapper = document.getElementById("journey-wrapper")
      const isMobile = window.innerWidth < 768

      // Clean up previous matchMedia

      // Mobile: simplified animation, no force3D, shorter duration
      if (isMobile) {
        tl.set(heroSection, { opacity: 1 })
        tl.set(".curtain-bg", { scale: 0.001, opacity: 1 })

        // Simple fade + scale for each frame
        frames.forEach((_, i) => {
          const pos = i === 0 ? 0.3 : 0.8
          tl.set(`.photo-bg-${i}`, { opacity: 0 })
          tl.to(
            `.photo-bg-${i}`,
            { opacity: 1, duration: 0.6, ease: "power2.out" },
            pos
          )
          if (i < frames.length - 1) {
            tl.to(
              `.photo-bg-${i}`,
              { opacity: 0, duration: 0.4, ease: "power2.in" },
              pos + 0.5
            )
          }
        })

        tl.to(
          heroSection,
          { opacity: 0, duration: 0.3, ease: "power1.inOut" },
          "heroFade"
        ).to(journeyWrapper, { opacity: 1, pointerEvents: "auto" }, "heroFade")

        // Simple slide-out for curtain on mobile
        if (leftHalfRef.current && rightHalfRef.current) {
          tl.to(
            leftHalfRef.current,
            { xPercent: -100, duration: 0.7, ease: "power2.inOut" },
            "split"
          ).to(
            rightHalfRef.current,
            { xPercent: 100, duration: 0.7, ease: "power2.inOut" },
            "split"
          )
        }

        return tl
      }

      // Desktop: full animation
      const STAGGER = 0.25
      const FRAME_DUR = 1.2
      const IMAGE_DUR = 0.75

      tl.set(heroSection, { opacity: 1 })
      tl.set(".curtain-bg", { scaleX: 0.001, scaleY: 0.001 })

      frames.forEach((_, i) => {
        tl.set(`.photo-bg-${i}`, { scale: 0.001 })
        tl.set(`.photo-inner-${i}`, { y: "30%" })
      })

      // Curtain emerge: small dot → vertical line → expand
      tl.to(".curtain-bg", {
        scaleX: 0.008,
        scaleY: 0.013,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.5,
      })
        .to(".curtain-bg", { scaleY: 1, duration: 0.7, ease: "power3.out" })
        .to(".curtain-bg", { scaleX: 1, duration: 0.6, ease: "expo.inOut" })

      // Frame photos slide in one by one
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

      // Fade hero before split
      tl.to(
        heroSection,
        { opacity: 0, duration: 0.25, ease: "power1.inOut" },
        "heroFade"
      ).to(journeyWrapper, { opacity: 1, pointerEvents: "auto" }, "heroFade")

      // Split curtain left and right
      if (leftHalfRef.current && rightHalfRef.current) {
        tl.to(
          leftHalfRef.current,
          {
            xPercent: -100,
            duration: 1.1,
            ease: "expo.inOut",
          },
          "split"
        ).to(
          rightHalfRef.current,
          {
            xPercent: 100,
            duration: 1.1,
            ease: "expo.inOut",
          },
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
