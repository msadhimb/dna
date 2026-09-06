import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import usePreloadImages from "./hooks/usePreloadImages"

interface LoadingScreenProps {
  onComplete: () => void
}

const MESSAGES = [
  "Mohon Menunggu sebentar",
  "Internet kamu agak lemot ya?",
  "Eve sedang bekerja",
  "Hampir Sampai",
  "Loading...",
  "Tunggu sebentar lagi",
]

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const loadingScreenRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (messageRef.current) {
        gsap.to(messageRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.3,
          ease: "power2.in",
          overwrite: "auto",
          force3D: true,
          onComplete: () => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
          },
        })
      } else {
        setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
      }
    }, 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (messageRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", force3D: true, overwrite: "auto" }
      )
    }
  }, [msgIndex])

  // Throttle progress -> React state agar tidak re-render tiap batch decode
  const rafProgressRef = useRef<number | null>(null)
  const throttledSetProgress = (p: number) => {
    if (rafProgressRef.current) cancelAnimationFrame(rafProgressRef.current)
    rafProgressRef.current = requestAnimationFrame(() => setProgress(p))
  }

  usePreloadImages(throttledSetProgress, () => {
    gsap.to(loadingScreenRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => {
        if (loadingScreenRef.current) {
          loadingScreenRef.current.style.pointerEvents = "none"
        }
        onComplete()
      },
    })
  })

  return (
    <div
      ref={loadingScreenRef}
      className="loading-screen fixed inset-0 z-100 flex items-center justify-center bg-background px-6 text-foreground"
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p
          ref={messageRef}
          className="max-w-md font-serif leading-relaxed tracking-wide text-2xl md:text-4xl"
          aria-live="polite"
        >
          {MESSAGES[msgIndex]}
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-muted dark:bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${progress}%`, willChange: "width" }}
            />
          </div>
          <p className="font-sans font-medium">{progress}%</p>
        </div>
      </div>
    </div>
  )
}
