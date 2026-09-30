"use client"

import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import type { WelcomeSectionRef } from "@/components/WelcomeSection"
import type { CurtainTransitionRef } from "@/components/Transition/CuratinTransition"
import type { BioSequenceRef as JourneySequenceRef } from "@/components/BioSequence"
import type { LoveJourneyHorizontalRef } from "@/components/LoveJourneyHorizontal"
import type { BookFlipRef } from "@/components/BookFlip"
import type { CommentSectionRef } from "@/components/CommentSection"

type Refs = {
  welcomeRef: React.RefObject<WelcomeSectionRef | null>
  curtainRef: React.RefObject<CurtainTransitionRef | null>
  journeyRef: React.RefObject<JourneySequenceRef | null>
  loveJourneyRef: React.RefObject<LoveJourneyHorizontalRef | null>
  bookFlipRef?: React.RefObject<BookFlipRef | null>
  commentRef: React.RefObject<CommentSectionRef | null>
}

type Options = {
  isLoaded: boolean
  theme: string
}

export function usePinnedScrollSequence(
  mainRef: React.RefObject<HTMLElement | null>,
  refs: Refs,
  { isLoaded, theme }: Options
) {
  const masterTlRef = useRef<gsap.core.Timeline | null>(null)
  const curtainWrapRef = useRef<gsap.core.Timeline | null>(null)
  const journeyWrapRef = useRef<gsap.core.Timeline | null>(null)
  const loveJourneyWrapRef = useRef<gsap.core.Timeline | null>(null)
  const bookFlipWrapRef = useRef<gsap.core.Timeline | null>(null)
  const commentWrapRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      if (!isLoaded) return

      const masterTrigger = document.getElementById("master-trigger")
      const journeyWrapper = document.getElementById("journey-wrapper")
      const loveJourneyWrapper = document.getElementById("love-journey-wrapper")
      const bookFlipWrapper = document.getElementById("book-flip-wrapper")

      if (
        !masterTrigger ||
        !journeyWrapper ||
        !loveJourneyWrapper ||
        !refs.welcomeRef.current ||
        !refs.curtainRef.current ||
        !refs.journeyRef.current ||
        !refs.loveJourneyRef.current
      )
        return

      const hasBookFlip =
        Boolean(bookFlipWrapper) && Boolean(refs.bookFlipRef?.current)

      const isMobileSetup =
        window.innerWidth < 768 ||
        (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)

      gsap.set(journeyWrapper, { opacity: 0 })
      gsap.set(loveJourneyWrapper, { opacity: 0, y: "100%" })
      if (bookFlipWrapper) gsap.set(bookFlipWrapper, { opacity: 0, y: "100%" })

      const welcomeTl = refs.welcomeRef.current.getTimeline()
      const curtainTl = refs.curtainRef.current.getTimeline()
      const journeyTl = refs.journeyRef.current.getTimeline()
      const loveJourneyTl = refs.loveJourneyRef.current.getTimeline()
      const bookFlipTl = refs.bookFlipRef?.current?.getTimeline()

      refs.commentRef.current?.getTimeline()

      const wDur = welcomeTl.totalDuration() || 1
      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const lDur = loveJourneyTl.totalDuration() || 1
      const bDur = bookFlipTl?.totalDuration() || 0
      const totalDur = wDur + cDur + jDur + lDur + bDur
      const totalScrollHeight = (totalDur / (cDur + jDur + lDur + bDur)) * 500

      const FADE = 0.2
      const slideDur = isMobileSetup ? 1.2 : 0.6

      let loveSnapPoints: number[] = []
      let snapZoneStart = 0
      let snapZoneEnd = 0

      const snapFn = (v: number) => {
        let best = v
        let bestDist = Infinity
        for (const s of loveSnapPoints) {
          const d = Math.abs(v - s)
          if (d < bestDist) {
            bestDist = d
            best = s
          }
        }
        if (v < snapZoneStart || v > snapZoneEnd) return v

        if (bestDist < 0.05) return best
        return v
      }

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainWrapRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.to(journeyWrapper, { opacity: 1, duration: 0.2 })
      journeyWrapperTl.add(journeyTl)
      journeyWrapRef.current = journeyWrapperTl

      const loveJourneyWrapperTl = gsap.timeline()
      loveJourneyWrapperTl.to(
        [journeyWrapper, loveJourneyWrapper],
        {
          y: (i: number) => (i === 0 ? "-100%" : "0%"),
          opacity: 1,
          duration: isMobileSetup ? 1.2 : 0.6,
          ease: "none",
          force3D: true,
        },
        "<"
      )
      loveJourneyWrapperTl.add(loveJourneyTl)
      loveJourneyWrapRef.current = loveJourneyWrapperTl

      const transitionDuration = isMobileSetup ? 1.2 : 0.6
      const bookFlipWrapperTl = gsap.timeline()
      if (hasBookFlip && bookFlipWrapper && bookFlipTl) {
        bookFlipWrapperTl.to(
          [loveJourneyWrapper, bookFlipWrapper],
          {
            y: (i: number) => (i === 0 ? "-100%" : "0%"),
            opacity: 1,
            duration: transitionDuration,
            ease: "none",
            force3D: true,
          },
          "<"
        )
        bookFlipWrapperTl.add(bookFlipTl)
      }
      bookFlipWrapRef.current = bookFlipWrapperTl

      const commentWrapperTl = gsap.timeline()
      commentWrapRef.current = commentWrapperTl

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterTrigger,
          start: "top top",
          end: `+=${totalScrollHeight}%`,
          pin: true,
          pinSpacing: true,

          scrub: isMobileSetup ? 0.6 : 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          fastScrollEnd: true,
          snap: {
            snapTo: snapFn,
            duration: { min: 0.12, max: 0.5 },

            delay: 0.25,
            ease: "power2.inOut",
            inertia: false,
          },
        },
      })

      masterTl.add(welcomeTl)
      masterTl.add(curtainWrapper)
      masterTl.add(journeyWrapperTl)
      masterTl.add(loveJourneyWrapperTl)
      masterTl.add(bookFlipWrapperTl)

      {
        const actualTotal = masterTl.totalDuration() || 1
        const wrapStart = loveJourneyWrapperTl.startTime() || 0
        const contentStart = wrapStart + slideDur
        const labels =
          (loveJourneyTl as unknown as { labels?: Record<string, number> })
            .labels ?? {}
        const times = [
          typeof labels.c0 === "number" ? labels.c0 : lDur * 0.05,
          typeof labels.c1 === "number" ? labels.c1 : lDur * 0.49,
          typeof labels.c2 === "number" ? labels.c2 : lDur * 0.93,
        ]
        loveSnapPoints = times.map((t) => (contentStart + t) / actualTotal)
        snapZoneStart = contentStart / actualTotal

        const loveEnd = (contentStart + lDur) / actualTotal
        const c2point = loveSnapPoints[2]
        snapZoneEnd = Math.min(
          1,
          c2point + Math.max(0, loveEnd - c2point) * 0.5
        )
      }

      masterTlRef.current = masterTl
    },
    { scope: mainRef, dependencies: [isLoaded] }
  )

  useEffect(() => {
    if (!isLoaded) return

    const cWrapper = curtainWrapRef.current
    const jWrapper = journeyWrapRef.current
    const lWrapper = loveJourneyWrapRef.current
    const bWrapper = bookFlipWrapRef.current

    if (
      !cWrapper ||
      !jWrapper ||
      !lWrapper ||
      !refs.curtainRef.current ||
      !refs.journeyRef.current ||
      !refs.loveJourneyRef.current
    )
      return

    const savedC = cWrapper.progress()
    const savedJ = jWrapper.progress()
    const savedL = lWrapper.progress()
    const savedB = bWrapper?.progress() ?? 0

    cWrapper.progress(0, true)
    jWrapper.progress(0, true)
    lWrapper.progress(0, true)
    bWrapper?.progress(0, true)

    cWrapper.clear()
    jWrapper.clear()
    lWrapper.clear()
    bWrapper?.clear()

    const journeyWrap = document.getElementById("journey-wrapper")
    const loveJourneyWrap = document.getElementById("love-journey-wrapper")
    const bookFlipWrap = document.getElementById("book-flip-wrapper")
    if (journeyWrap) gsap.set(journeyWrap, { clearProps: "all" })
    if (loveJourneyWrap) gsap.set(loveJourneyWrap, { clearProps: "all" })
    if (bookFlipWrap) gsap.set(bookFlipWrap, { clearProps: "all" })

    if (journeyWrap) gsap.set(journeyWrap, { opacity: 0 })
    if (loveJourneyWrap) gsap.set(loveJourneyWrap, { opacity: 0, y: "100%" })
    if (bookFlipWrap) gsap.set(bookFlipWrap, { opacity: 0, y: "100%" })

    const newCurtainTl = refs.curtainRef.current.getTimeline()
    const newJourneyTl = refs.journeyRef.current.getTimeline()
    const newLoveJourneyTl = refs.loveJourneyRef.current.getTimeline()
    const newBookFlipTl = refs.bookFlipRef?.current?.getTimeline()

    refs.commentRef.current?.getTimeline()

    cWrapper.add(newCurtainTl)

    jWrapper.to(journeyWrap, { opacity: 1, duration: 0.2 })
    jWrapper.add(newJourneyTl)

    const isMobileTheme =
      window.innerWidth < 768 ||
      (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)

    lWrapper.to(
      [journeyWrap, loveJourneyWrap],
      {
        y: (i: number) => (i === 0 ? "-100%" : "0%"),
        opacity: 1,
        duration: isMobileTheme ? 1.2 : 0.6,
        ease: "none",
        force3D: true,
      },
      "<"
    )
    lWrapper.add(newLoveJourneyTl)

    if (bWrapper && newBookFlipTl) {
      bWrapper.to(
        [loveJourneyWrap, bookFlipWrap],
        {
          y: (i: number) => (i === 0 ? "-100%" : "0%"),
          opacity: 1,
          duration: isMobileTheme ? 1.2 : 0.6,
          ease: "none",
          force3D: true,
        },
        "<"
      )
      bWrapper.add(newBookFlipTl)
    }

    cWrapper.progress(savedC, true)
    jWrapper.progress(savedJ, true)
    lWrapper.progress(savedL, true)
    bWrapper?.progress(savedB, true)

    const masterST = masterTlRef.current?.scrollTrigger
    if (masterST) {
      const newTotal =
        (newCurtainTl.totalDuration() || 1) +
        (newJourneyTl.totalDuration() || 1) +
        (newLoveJourneyTl.totalDuration() || 1) +
        (newBookFlipTl?.totalDuration() || 0) +
        (masterTlRef.current
          ? (masterTlRef.current as any)._welcomeDur || 1
          : 1)

      const wD = (masterTlRef.current?.totalDuration() || 1) - newTotal

    }

    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [theme, isLoaded])

  return { masterTlRef }
}
