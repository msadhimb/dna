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
import BookFlip, { BookFlipRef } from "@/components/BookFlip"

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
  const bookRef = useRef<BookFlipRef>(null)

  const curtainTlRef = useRef<gsap.core.Timeline | null>(null)
  const journeyTlRef = useRef<gsap.core.Timeline | null>(null)
  const bookTlRef = useRef<gsap.core.Timeline | null>(null)

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
        !journeyRef.current ||
        !bookRef.current
      )
        return

      gsap.set(journeyWrapper, { opacity: 0 })

      const bookWrap = document.getElementById("book-wrapper")
      if (bookWrap) gsap.set(bookWrap, { opacity: 0 })

      const curtainTl = curtainRef.current.getTimeline()
      const journeyTl = journeyRef.current.getTimeline()
      const bookTl = bookRef.current.getTimeline()

      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const bDur = bookTl.totalDuration() || 1
      const totalDur = cDur + jDur + bDur
      const totalScrollHeight = 1000 // Total scroll distance

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainTlRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.to(journeyWrapper, { opacity: 1, duration: 0.2 })
      journeyWrapperTl.add(journeyTl)
      journeyWrapperTl.to(journeyWrapper, {
        y: "-100vh",
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      })
      journeyTlRef.current = journeyWrapperTl

      const bookWrapperTl = gsap.timeline()
      if (bookWrap) {
        bookWrapperTl.set(bookWrap, { y: "100vh", opacity: 1 })
        bookWrapperTl.to(bookWrap, {
          y: "0vh",
          duration: 0.8,
          ease: "power2.out",
        })
      }
      bookWrapperTl.add(bookTl)
      bookTlRef.current = bookWrapperTl

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterTrigger,
          start: "top top",
          end: `+=${totalScrollHeight}%`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
        },
      })

      masterTl.add(curtainWrapper)
      masterTl.add(journeyWrapperTl)
      masterTl.add(bookWrapperTl, "-=0.8")
    },
    { scope: mainRef, dependencies: [isLoaded] }
  )

  useEffect(() => {
    const cWrapper = curtainTlRef.current
    const jWrapper = journeyTlRef.current
    const bWrapper = bookTlRef.current

    if (
      !cWrapper ||
      !jWrapper ||
      !bWrapper ||
      !curtainRef.current ||
      !journeyRef.current ||
      !bookRef.current
    )
      return

    const savedCProgress = cWrapper.progress()
    const savedJProgress = jWrapper.progress()
    const savedBProgress = bWrapper.progress()

    // Kembalikan ke posisi 0 agar DOM kembali bersih dari inline style GSAP lama
    cWrapper.progress(0, true)
    jWrapper.progress(0, true)
    bWrapper.progress(0, true)

    cWrapper.clear()
    jWrapper.clear()
    bWrapper.clear()

    const journeyWrap = document.getElementById("journey-wrapper")
    const bookWrap = document.getElementById("book-wrapper")
    if (journeyWrap) gsap.set(journeyWrap, { clearProps: "all" })
    if (bookWrap) gsap.set(bookWrap, { clearProps: "all" })

    const newCurtainTl = curtainRef.current.getTimeline()
    const newJourneyTl = journeyRef.current.getTimeline()
    const newBookTl = bookRef.current.getTimeline()

    cWrapper.add(newCurtainTl)
    jWrapper.add(newJourneyTl)
    bWrapper.add(newBookTl)

    cWrapper.progress(savedCProgress, true)
    jWrapper.progress(savedJProgress, true)
    bWrapper.progress(savedBProgress, true)
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
        <div
          id="book-wrapper"
          className="gsap-element pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center overflow-hidden bg-background opacity-0"
        >
          <BookFlip
            ref={bookRef}
            date="12 . 12 . 2026"
            dateLabel="Hari Pernikahan"
            location="Grand Ballroom, Semarang"
            locationLabel="Lokasi"
            coverTitle="The Wedding Of"
            coverSubtitle="Kevin & Amanda"
            monogram="K & A"
            width="min(92vw, 880px)"
            height="min(70vh, 560px)"
            mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d110.4!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d024d%3A0x1730a2f9788fa517!2sGrand%20Ballroom%20Semarang!5e0!3m2!1sen!2sid!4v1"
          />
        </div>
      </section>
    </main>
  )
}

export default MainView
