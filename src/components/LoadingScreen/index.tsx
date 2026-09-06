import React, { useEffect, useRef, useState } from "react"
import { gsap } from "@/lib/gsap"
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
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      )
    }
  }, [msgIndex])

  usePreloadImages(setProgress, () => {
    gsap.to(loadingScreenRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.inOut",
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
      role="status"
      aria-label="Memuat undangan"
      aria-busy={progress < 100}
      className="loading-screen fixed inset-0 z-100 flex items-center justify-center bg-background px-6 text-foreground"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <p
          ref={messageRef}
          className="max-w-md font-serif leading-relaxed tracking-wide text-2xl md:text-4xl"
          aria-live="polite"
          aria-atomic="true"
        >
          {MESSAGES[msgIndex]}
        </p>
        <div className="flex w-full max-w-xs flex-col items-center gap-3">
          <div
            className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/10"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progres memuat"
          >
            <div
              className="h-full bg-muted dark:bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-sans text-sm font-medium tabular-nums" aria-live="polite">
            {progress}%
          </p>
          <p className="font-sans text-xs text-muted-foreground">Menyiapkan foto dan musik...</p>
        </div>
      </div>
    </div>
  )
}
