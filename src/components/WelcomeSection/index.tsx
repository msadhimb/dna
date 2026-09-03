"use client"
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
} from "react"
import gsap from "gsap"
import { Music2, Hand } from "lucide-react"
import { useAudio } from "@/store/useAudio"

export interface WelcomeSectionRef {
  getTimeline: () => gsap.core.Timeline
}

export const WelcomeSection = forwardRef<
  WelcomeSectionRef,
  { guestName?: string }
>(({ guestName }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const { isPlaying, setIsPlaying } = useAudio()
  const [hintVisible, setHintVisible] = useState(true)

  
  useEffect(() => {
    if (isPlaying) {
      if (hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: "power2.inOut",
        })
      }
      const t = setTimeout(() => setHintVisible(false), 400)
      return () => clearTimeout(t)
    }
  }, [isPlaying])

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline()
      if (!containerRef.current || !textRef.current) return tl

      gsap.set(containerRef.current, { opacity: 1, y: 0, force3D: true })
      gsap.set(textRef.current, { y: 0, opacity: 1, force3D: true })

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

  const handleTap = () => {
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      className="absolute inset-0 z-50 flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-background"
      style={{ willChange: "transform, opacity" }}
    >
      <div
        ref={textRef}
        className="flex w-full max-w-5xl flex-col items-center justify-center px-4 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <p className="mb-5 font-serif text-[10px] font-semibold tracking-[0.55em] text-foreground/55 uppercase md:text-xs">
          {guestName ? "Kepada Tamu Kehormatan" : "You Are Invited"}
        </p>
        <h1 className="mb-5 max-w-[90vw] wrap-break-word font-serif text-4xl leading-tight font-semibold tracking-[0.03em] text-foreground md:max-w-4xl md:text-6xl">
          {guestName ? `Selamat Datang, ${guestName}` : "Welcome"}
        </h1>
        <p className="font-serif text-base font-medium tracking-[0.28em] text-foreground/65 uppercase md:text-xl md:tracking-[0.38em]">
          {guestName ? "Di Pernikahan Kami" : "To Our Wedding"}
        </p>
      </div>

      
      {hintVisible && (
        <div
          ref={hintRef}
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full px-5 py-3 text-xs font-medium text-black dark:text-white md:px-6 md:py-3.5 md:text-sm"
          style={{
            bottom: "max(2.5rem, env(safe-area-inset-bottom, 0px) + 1.5rem)",
          }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15">
            <Music2 className="h-3.5 w-3.5" />
          </span>
          <span className="whitespace-nowrap">
            Scroll atau tap untuk memutar musik
          </span>
        </div>
      )}
    </div>
  )
})

WelcomeSection.displayName = "WelcomeSection"
