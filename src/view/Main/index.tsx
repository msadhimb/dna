"use client"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import HeroSection from "./components/HeroSection"
import {
  CurtainTransition,
  CurtainTransitionRef,
} from "@/components/Transition/CuratinTransition"
import JourneySequence, {
  JourneySequenceRef,
} from "@/components/JourneySequence"
import { WelcomeSection } from "./components/WelcomeSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

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
      <div className="flex h-full w-full items-center justify-center bg-primary font-signature text-2xl font-bold tracking-wider text-muted md:text-3xl">
        <p className="max-w-sm text-center md:max-w-lg">
          Dalam setiap pagi yang penuh harapan, kami menemukan alasan untuk
          tersenyum. Dalam setiap langkah yang kami tempuh bersama, tumbuh
          keyakinan bahwa cinta ini layak diperjuangkan.
        </p>
      </div>
    ),
    dark: (
      <div className="flex h-full w-full items-center justify-center bg-primary font-signature text-2xl font-bold tracking-wider text-black md:text-3xl">
        <p className="max-w-sm text-center md:max-w-lg">
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

  const mainRef = useRef<HTMLElement>(null)
  const curtainRef = useRef<CurtainTransitionRef>(null)
  const journeyRef = useRef<JourneySequenceRef>(null)

  const curtainTlRef = useRef<gsap.core.Timeline | null>(null)
  const journeyTlRef = useRef<gsap.core.Timeline | null>(null)

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

  useGSAP(
    () => {
      if (!isLoaded) return

      const masterTrigger = document.getElementById("master-trigger")
      const journeyWrapper = document.getElementById("journey-wrapper")

      if (
        !masterTrigger ||
        !journeyWrapper ||
        !curtainRef.current ||
        !journeyRef.current
      )
        return

      gsap.set(journeyWrapper, { opacity: 0 })

      const curtainTl = curtainRef.current.getTimeline()
      const journeyTl = journeyRef.current.getTimeline()

      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const totalDur = cDur + jDur

      const curtainScroll = (cDur / totalDur) * 700
      const journeyScroll = (jDur / totalDur) * 700

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainTlRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.add(journeyTl)
      journeyTlRef.current = journeyWrapperTl

      ScrollTrigger.create({
        trigger: masterTrigger,
        start: "top top",
        end: "+=700%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      })

      const curtainST = ScrollTrigger.create({
        animation: curtainWrapper,
        trigger: masterTrigger,
        start: "top top",
        end: `+=${curtainScroll}%`,
        scrub: 1,
      })

      ScrollTrigger.create({
        animation: journeyWrapperTl,
        start: () => curtainST.end,
        end: () => curtainST.end + window.innerHeight * (journeyScroll / 100),
        scrub: 1,
      })
    },
    { scope: mainRef, dependencies: [isLoaded] }
  )

  useEffect(() => {
    const cWrapper = curtainTlRef.current
    const jWrapper = journeyTlRef.current

    if (!cWrapper || !jWrapper || !curtainRef.current || !journeyRef.current) return

    const savedCProgress = cWrapper.progress()
    const savedJProgress = jWrapper.progress()

    // Kembalikan ke posisi 0 agar DOM kembali bersih dari inline style GSAP lama
    cWrapper.progress(0, true)
    jWrapper.progress(0, true)

    cWrapper.clear()
    jWrapper.clear()

    const newCurtainTl = curtainRef.current.getTimeline()
    const newJourneyTl = journeyRef.current.getTimeline()

    cWrapper.add(newCurtainTl)
    jWrapper.add(newJourneyTl)

    cWrapper.progress(savedCProgress, true)
    jWrapper.progress(savedJProgress, true)
  }, [theme])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Heart className="h-6 w-6 animate-pulse text-foreground/20" />
      </div>
    )
  }

  return (
    <main ref={mainRef}>
      {!isLoaded && (
        <LoadingScreen
          imageUrls={urlsToPreload}
          onComplete={() => setIsLoaded(true)}
        />
      )}

      <WelcomeSection />

      <section
        id="master-trigger"
        className="gsap-element relative h-screen w-full overflow-hidden bg-background"
      >
        <div className="absolute inset-0 z-0">
          <HeroSection />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30">
          <CurtainTransition ref={curtainRef} frames={frames} />
        </div>

        <div
          id="journey-wrapper"
          className="gsap-element pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center overflow-hidden bg-background opacity-0"
        >
          <JourneySequence ref={journeyRef} theme={theme} />
        </div>
      </section>
      <div className="h-screen w-full bg-background" />
    </main>
  )
}

export default MainView
