"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import HeroSection from "../../components/HeroSection"
import {
  CurtainTransition,
  CurtainTransitionRef,
} from "@/components/Transition/CuratinTransition"
import JourneySequence, {
  JourneySequenceRef,
} from "@/components/JourneySequence"
import BookFlip, { BookFlipRef } from "@/components/BookFlip"
import { WelcomeSection } from "../../components/WelcomeSection"
import { LoadingScreen } from "@/components/LoadingScreen"
import RomanticQuote from "@/components/RomanticQuote"
import DigitalGift from "@/components/DigitalGift"
import CommentSection, { CommentSectionRef } from "@/components/CommentSection"
import Footer from "@/components/Footer"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

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
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-primary px-6 py-10 text-muted md:px-10">
        {/* Ayat */}
        <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
          لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
          إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 opacity-70">
          <span className="h-px w-8 bg-current" />
          <span className="text-xs">✦</span>
          <span className="h-px w-8 bg-current" />
        </div>

        {/* Reference */}
        <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
          QS. Ar-Rum : 21
        </p>

        {/* Translation */}
        <p className="max-w-sm text-center font-sans text-sm leading-relaxed font-light italic opacity-90 md:max-w-lg">
          &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
          pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung
          dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa
          kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
          terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
        </p>
      </div>
    ),
    dark: (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-primary px-6 py-10 text-black md:px-10">
        {/* Ayat */}
        <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
          رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ
          أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
        </p>

        {/* Ornamental divider */}
        <div className="flex items-center gap-3 opacity-70">
          <span className="h-px w-8 bg-current" />
          <span className="text-xs">✦</span>
          <span className="h-px w-8 bg-current" />
        </div>

        {/* Reference */}
        <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
          QS. Al-Furqan : 74
        </p>

        {/* Translation */}
        <p className="max-w-sm text-center font-sans text-sm leading-relaxed font-light italic opacity-90 md:max-w-lg">
          &ldquo;Wahai Tuhan kami, anugerahkanlah kepada kami istri-istri kami
          dan keturunan kami sebagai penyejuk mata (bagi kami), dan jadikanlah
          kami imam bagi orang-orang yang bertakwa.&rdquo;
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
  const bookFlipRef = useRef<BookFlipRef>(null)
  const commentRef = useRef<CommentSectionRef>(null)

  const curtainTlRef = useRef<gsap.core.Timeline | null>(null)
  const journeyTlRef = useRef<gsap.core.Timeline | null>(null)
  const bookFlipTlRef = useRef<gsap.core.Timeline | null>(null)
  const commentTlRef = useRef<gsap.core.Timeline | null>(null)
  const masterTlRef = useRef<gsap.core.Timeline | null>(null)

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
      const bookFlipWrapper = document.getElementById("book-flip-wrapper")

      if (
        !masterTrigger ||
        !journeyWrapper ||
        !bookFlipWrapper ||
        !curtainRef.current ||
        !journeyRef.current ||
        !bookFlipRef.current ||
        !commentRef.current
      )
        return

      gsap.set(journeyWrapper, { opacity: 0 })
      gsap.set(bookFlipWrapper, { opacity: 0, y: "100%" })

      const curtainTl = curtainRef.current.getTimeline()
      const journeyTl = journeyRef.current.getTimeline()
      const bookFlipTl = bookFlipRef.current.getTimeline()

      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const bDur = bookFlipTl.totalDuration() || 1
      const totalScrollHeight =
        ((cDur + jDur + bDur) / (cDur + jDur + bDur)) * 1500

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainTlRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.to(journeyWrapper, { opacity: 1, duration: 0.2 })
      journeyWrapperTl.add(journeyTl)

      journeyTlRef.current = journeyWrapperTl

      const bookFlipWrapperTl = gsap.timeline()
      bookFlipWrapperTl.to(
        [journeyWrapper, bookFlipWrapper],
        {
          y: (i) => (i === 0 ? "-100%" : "0%"),
          opacity: 1,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "<"
      )
      bookFlipWrapperTl.add(bookFlipTl)

      bookFlipTlRef.current = bookFlipWrapperTl

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
      masterTl.add(bookFlipWrapperTl)

      const commentWrapperTl = gsap.timeline()
      const commentTl = commentRef.current?.getTimeline()
      if (commentTl) {
        commentWrapperTl.add(commentTl)
        masterTl.add(commentWrapperTl)
      }

      commentTlRef.current = commentWrapperTl
      masterTlRef.current = masterTl
    },
    { scope: mainRef, dependencies: [isLoaded] }
  )

  useEffect(() => {
    const cWrapper = curtainTlRef.current
    const jWrapper = journeyTlRef.current
    const bWrapper = bookFlipTlRef.current
    const coWrapper = commentTlRef.current

    if (
      !cWrapper ||
      !jWrapper ||
      !bWrapper ||
      !curtainRef.current ||
      !journeyRef.current ||
      !bookFlipRef.current ||
      !commentRef.current
    )
      return

    const savedCProgress = cWrapper.progress()
    const savedJProgress = jWrapper.progress()
    const savedBProgress = bWrapper.progress()
    const savedCoProgress = coWrapper?.progress() ?? 0

    // Kembalikan ke posisi 0 agar DOM kembali bersih dari inline style GSAP lama
    cWrapper.progress(0, true)
    jWrapper.progress(0, true)
    bWrapper.progress(0, true)
    coWrapper?.progress(0, true)

    cWrapper.clear()
    jWrapper.clear()
    bWrapper.clear()
    coWrapper?.clear()

    const journeyWrap = document.getElementById("journey-wrapper")
    if (journeyWrap) gsap.set(journeyWrap, { clearProps: "all" })

    const bookFlipWrap = document.getElementById("book-flip-wrapper")
    if (bookFlipWrap) gsap.set(bookFlipWrap, { clearProps: "all" })

    const newCurtainTl = curtainRef.current.getTimeline()
    const newJourneyTl = journeyRef.current.getTimeline()
    const newBookFlipTl = bookFlipRef.current.getTimeline()
    const newCommentTl = commentRef.current.getTimeline()

    cWrapper.add(newCurtainTl)
    jWrapper.to(journeyWrap, { opacity: 1, duration: 0.2 })
    jWrapper.add(newJourneyTl)

    if (coWrapper) {
      coWrapper.add(newCommentTl)
      coWrapper.progress(savedCoProgress, true)
    }

    bWrapper.to(
      [journeyWrap, bookFlipWrap],
      {
        y: (i) => (i === 0 ? "-100%" : "0%"),
        opacity: 1,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    )
    bWrapper.add(newBookFlipTl)

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
          id="book-flip-wrapper"
          className="gsap-element pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col justify-center overflow-hidden bg-background opacity-0"
        >
          <BookFlip
            ref={bookFlipRef}
            theme={theme}
            date="12 Desember 2026"
            location="Gedung Pernikahan"
            mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126938.99587422934!2d106.74958107931326!3d-6.15570075591392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid"
          />
        </div>
      </section>
      <RomanticQuote />
      <CommentSection ref={commentRef} />
      <DigitalGift />
      <Footer />
    </main>
  )
}

export default MainView
