import React, { useEffect, useState } from "react"
import { gsap } from "gsap"

interface LoadingScreenProps {
  imageUrls: string[]
  onComplete: () => void
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  imageUrls,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    let loadedImages = 0
    const totalImages = imageUrls.length

    if (totalImages === 0) {
      setProgress(100)
      setTimeout(onComplete, 500)
      return
    }

    const handleImageLoad = () => {
      loadedImages++
      const currentProgress = Math.floor((loadedImages / totalImages) * 100)
      setProgress(currentProgress)

      if (loadedImages === totalImages) {
        // All images loaded
        gsap.to(".loading-screen", {
          opacity: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete()
          },
        })
      }
    }

    imageUrls.forEach((url) => {
      const img = new Image()
      img.src = url
      img.onload = handleImageLoad
      img.onerror = handleImageLoad // count errors as loaded so it doesn't get stuck
    })
  }, [imageUrls, onComplete])

  return (
    <div className="loading-screen fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl font-light tracking-widest uppercase">
          Loading
        </h2>
        <p className="text-xl font-medium">{progress}%</p>
      </div>
    </div>
  )
}
