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
      className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-background px-6 text-foreground"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <p
          ref={messageRef}
          className="max-w-md font-serif text-lg italic leading-relaxed tracking-wide md:text-xl"
          aria-live="polite"
        >
          {MESSAGES[msgIndex]}
        </p>
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-24 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-sans  font-medium tracking-[0.35em]">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
