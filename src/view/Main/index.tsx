"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import HeroSection from "./components/HeroSection"
import { CurtainTransition } from "@/components/Transition/CuratinTransition"
import { JourneySequence } from "@/components/JourneySequence"
// import { JourneySequence } from "./components/JourneySequence"

import { WelcomeSection } from "./components/WelcomeSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import Image from "next/image"

const PREVIEW_FRAMES = [
  {
    light: "/asset/pre-wed/image/light/2.jpg",
    dark: "/asset/pre-wed/image/dark/2.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/3.jpg",
    dark: "/asset/pre-wed/image/dark/3.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/4.jpg",
    dark: "/asset/pre-wed/image/dark/4.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/5.jpg",
    dark: "/asset/pre-wed/image/dark/5.jpg",
  },
  {
    light: "/asset/pre-wed/image/light/6.jpg",
    dark: "/asset/pre-wed/image/dark/6.jpg",
  },
  {
    light: (
      <div className="flex h-full w-full items-center justify-center bg-primary font-serif text-3xl tracking-wider text-muted">
        <p className="max-w-lg text-center">
          Dalam setiap pagi yang penuh harapan, kami menemukan alasan untuk
          tersenyum. Dalam setiap langkah yang kami tempuh bersama, tumbuh
          keyakinan bahwa cinta ini layak diperjuangkan.
        </p>
      </div>
    ),
    dark: (
      <div className="flex h-full w-full items-center justify-center bg-primary font-serif text-3xl tracking-wider text-white">
        <p className="max-w-lg text-center">
          Dalam malam yang sunyi, kami belajar tentang kesabaran, pengertian,
          dan ketulusan. Karena cinta sejati bukan hanya hadir dalam cahaya,
          tetapi juga tetap bertahan dalam gelap.
        </p>
      </div>
    ),
  },
]

const MainView = () => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  // Extract URLs to preload based on theme (only if they are strings)
  const urlsToPreload = useMemo(() => {
    return (
      theme === "dark"
        ? PREVIEW_FRAMES.map((f) => f.dark)
        : PREVIEW_FRAMES.map((f) => f.light)
    ).filter((content) => typeof content === "string") as string[]
  }, [theme])

  const frames = useMemo(() => {
    return PREVIEW_FRAMES.map((frame, i) => {
      const content = theme === "dark" ? frame.dark : frame.light

      if (typeof content === "string") {
        return (
          <Image
            key={i}
            src={content}
            alt={`Curtain Photo ${i + 1}`}
            fill
            sizes="130vw"
            priority={i === 0}
            className="object-cover object-center"
          />
        )
      }

      // Jika content adalah ReactNode (bukan string URL)
      return (
        <div key={i} className="absolute inset-0 h-full w-full">
          {content}
        </div>
      )
    })
  }, [theme])

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
      <CurtainTransition frames={frames} />
      {/* <JourneySequence theme={theme} /> */}
      <div className="h-[300vh] w-full bg-background" />
    </main>
  )
}

export default MainView
