"use client"

import React, { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import HeroSection from "./components/HeroSection"
import { CurtainTransition } from "@/components/Transition/CuratinTransition"
import { JourneySequence } from "@/components/JourneySequence"
// import { JourneySequence } from "./components/JourneySequence"

import { WelcomeSection } from "./components/WelcomeSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import { PREVIEW_FRAMES } from "@/components/Transition/CuratinTransition"

const MainView = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Heart className="h-6 w-6 animate-pulse text-foreground/20" />
      </div>
    )
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light"
  
  // Extract URLs to preload based on theme
  const urlsToPreload = theme === "dark" 
    ? PREVIEW_FRAMES.map((f) => f.dark) 
    : PREVIEW_FRAMES.map((f) => f.light)

  return (
    <main>
      {!isLoaded && (
        <LoadingScreen 
          imageUrls={urlsToPreload} 
          onComplete={() => setIsLoaded(true)} 
        />
      )}

      {/* 0. Welcome */}
      <WelcomeSection />

      {/* 1. Hero */}
      <HeroSection />
      <CurtainTransition theme={theme} />
      {/* <JourneySequence theme={theme} /> */}
      <div className="h-[300vh] w-full bg-background" />
    </main>
  )
}

export default MainView
