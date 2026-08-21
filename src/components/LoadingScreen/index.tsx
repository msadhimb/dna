import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import usePreloadImages from "./hooks/usePreloadImages"

interface LoadingScreenProps {
  onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const loadingScreenRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  usePreloadImages(setProgress, () => {
    gsap.to(loadingScreenRef.current, {
      opacity: 0,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        // An invisible fixed layer can still intercept touch events on mobile.
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
      className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground"
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl font-light tracking-widest uppercase">
          Loading
        </h2>
        <p className="text-xl font-medium">{progress}%</p>
      </div>
    </div>
  )
}
