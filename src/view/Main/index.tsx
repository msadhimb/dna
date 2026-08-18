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
import { Tools } from "@/components/Tools"
import { useImageUrl } from "@/store/useImageUrl"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  })
}

const MainView = () => {
  const { resolvedTheme } = useTheme()
  const { imageUrl } = useImageUrl()

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

  const PREVIEW_FRAMES = [
    {
      light: imageUrl.light?.[1]?.link,
      dark: imageUrl.dark?.[1]?.link,
    },
    {
      light: imageUrl.light?.[2]?.link,
      dark: imageUrl.dark?.[2]?.link,
    },
    {
      light: imageUrl.light?.[3]?.link,
      dark: imageUrl.dark?.[3]?.link,
    },
    {
      light: imageUrl.light?.[4]?.link,
      dark: imageUrl.dark?.[4]?.link,
    },
    {
      light: imageUrl.light?.[5]?.link,
      dark: imageUrl.dark?.[5]?.link,
    },
    {
      light: (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-primary px-6 py-10 text-muted md:px-10">
          <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
            لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
            إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <div className="flex items-center gap-3 opacity-70">
            <span className="h-px w-8 bg-current" />
            <span className="text-xs">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
            QS. Ar-Rum : 21
          </p>
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
          <p className="max-w-sm text-center font-signature text-2xl leading-relaxed font-bold tracking-wide md:max-w-lg md:text-3xl">
            رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ
            أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا
          </p>
          <div className="flex items-center gap-3 opacity-70">
            <span className="h-px w-8 bg-current" />
            <span className="text-xs">✦</span>
            <span className="h-px w-8 bg-current" />
          </div>
          <p className="font-sans text-xs tracking-[0.2em] uppercase opacity-80">
            QS. Al-Furqan : 74
          </p>
          <p className="max-w-sm text-center font-sans text-sm leading-relaxed font-light italic opacity-90 md:max-w-lg">
            &ldquo;Wahai Tuhan kami, anugerahkanlah kepada kami istri-istri kami
            dan keturunan kami sebagai penyejuk mata (bagi kami), dan jadikanlah
            kami imam bagi orang-orang yang bertakwa.&rdquo;
          </p>
        </div>
      ),
    },
  ]

  const frames = useMemo(() => {
    return PREVIEW_FRAMES.map((frame, i) => {
      const content: any = theme === "dark" ? frame.dark : frame.light

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

      return (
        <div key={i} className="absolute inset-0 h-full w-full">
          {content}
        </div>
      )
    })
  }, [theme, imageUrl])

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

      const isMobileSetup = window.innerWidth < 768

      // Promote kedua wrapper ke GPU compositor layer sejak awal
      gsap.set(journeyWrapper, {
        opacity: 0,
        force3D: true,
        willChange: "transform, opacity",
      })
      gsap.set(bookFlipWrapper, {
        opacity: 0,
        y: "100%",
        force3D: true,
        willChange: "transform, opacity",
      })

      const curtainTl = curtainRef.current.getTimeline()
      const journeyTl = journeyRef.current.getTimeline()
      const bookFlipTl = bookFlipRef.current.getTimeline()

      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const bDur = bookFlipTl.totalDuration() || 1
      const totalScrollHeight =
        ((cDur + jDur + bDur) / (cDur + jDur + bDur)) * 500

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainTlRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.to(journeyWrapper, { opacity: 1, duration: 0.2 })
      journeyWrapperTl.add(journeyTl)

      journeyTlRef.current = journeyWrapperTl

      // Di mobile, gunakan durasi lebih panjang agar animasi tidak terasa
      // patah saat scrub lag (scrub: 2 = 2 detik untuk menyesuaikan)
      const transitionDuration = isMobileSetup ? 1.2 : 0.6

      const bookFlipWrapperTl = gsap.timeline()
      bookFlipWrapperTl.to(
        [journeyWrapper, bookFlipWrapper],
        {
          y: (i) => (i === 0 ? "-100%" : "0%"),
          opacity: 1,
          duration: transitionDuration,
          ease: "none", // linear lebih smooth untuk scrub vs power2
          force3D: true,
        },
        "<"
      )
      bookFlipWrapperTl.add(bookFlipTl)

      bookFlipTlRef.current = bookFlipWrapperTl

      // Scrub lebih tinggi = animasi lebih smooth mengikuti scroll (mengurangi jank)
      // Hindari scrub < 1 karena akan terasa patah saat scroll cepat
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterTrigger,
          start: "top top",
          end: `+=${totalScrollHeight}%`,
          pin: true,
          pinSpacing: true,
          scrub: isMobileSetup ? 2.5 : 1.5,
          invalidateOnRefresh: true,
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
      !coWrapper ||
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

    const isMobileTheme = window.innerWidth < 768
    bWrapper.to(
      [journeyWrap, bookFlipWrap],
      {
        y: (i) => (i === 0 ? "-100%" : "0%"),
        opacity: 1,
        duration: isMobileTheme ? 1.2 : 0.6,
        ease: "none", // linear = konsisten dengan setup utama (scrub-friendly)
        force3D: true,
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
      <Tools />
      {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}

      <WelcomeSection />

      <section
        id="master-trigger"
        className="gsap-element relative h-screen w-full overflow-hidden bg-background"
        style={{ willChange: "transform" }}
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
          />
        </div>
      </section>
      <div className="flex flex-col gap-36">
        <RomanticQuote />
        <CommentSection ref={commentRef} />
        <DigitalGift />
        <Footer />
      </div>
    </main>
  )
}

export default MainView
