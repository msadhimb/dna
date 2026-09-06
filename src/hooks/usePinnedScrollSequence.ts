"use client"

import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import type { WelcomeSectionRef } from "@/components/WelcomeSection"
import type { CurtainTransitionRef } from "@/components/Transition/CuratinTransition"
import type { JourneySequenceRef } from "@/components/JourneySequence"
import type { BookFlipRef } from "@/components/BookFlip"
import type { CommentSectionRef } from "@/components/CommentSection"

type Refs = {
  welcomeRef: React.RefObject<WelcomeSectionRef | null>
  curtainRef: React.RefObject<CurtainTransitionRef | null>
  journeyRef: React.RefObject<JourneySequenceRef | null>
  bookFlipRef: React.RefObject<BookFlipRef | null>
  commentRef: React.RefObject<CommentSectionRef | null>
}

type Options = {
  isLoaded: boolean
  theme: string
}

/**
 * Orkestrator pinned scroll:
 * - Master pin dibuat sekali (deps: isLoaded)
 * - Theme change: patch inner timelines tanpa kill ScrollTrigger pin (agar tidak hilang)
 */
export function usePinnedScrollSequence(
  mainRef: React.RefObject<HTMLElement | null>,
  refs: Refs,
  { isLoaded, theme }: Options
) {
  const masterTlRef = useRef<gsap.core.Timeline | null>(null)
  const curtainWrapRef = useRef<gsap.core.Timeline | null>(null)
  const journeyWrapRef = useRef<gsap.core.Timeline | null>(null)
  const bookFlipWrapRef = useRef<gsap.core.Timeline | null>(null)
  const commentWrapRef = useRef<gsap.core.Timeline | null>(null)

  // 1) Build master pin sekali saat isLoaded
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
        !refs.welcomeRef.current ||
        !refs.curtainRef.current ||
        !refs.journeyRef.current ||
        !refs.bookFlipRef.current
      )
        return

      const isMobileSetup =
        window.innerWidth < 768 ||
        (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)

      // initial state tanpa willChange permanen (hemat compositor layer)
      gsap.set(journeyWrapper, { opacity: 0 })
      gsap.set(bookFlipWrapper, { opacity: 0, y: "100%" })

      const welcomeTl = refs.welcomeRef.current.getTimeline()
      const curtainTl = refs.curtainRef.current.getTimeline()
      const journeyTl = refs.journeyRef.current.getTimeline()
      const bookFlipTl = refs.bookFlipRef.current.getTimeline()
      const commentTl = refs.commentRef.current?.getTimeline()

      const wDur = welcomeTl.totalDuration() || 1
      const cDur = curtainTl.totalDuration() || 1
      const jDur = journeyTl.totalDuration() || 1
      const bDur = bookFlipTl.totalDuration() || 1
      const totalScrollHeight =
        ((wDur + cDur + jDur + bDur) / (cDur + jDur + bDur)) * 500

      const curtainWrapper = gsap.timeline()
      curtainWrapper.add(curtainTl)
      curtainWrapRef.current = curtainWrapper

      const journeyWrapperTl = gsap.timeline()
      journeyWrapperTl.to(journeyWrapper, { opacity: 1, duration: 0.2 })
      journeyWrapperTl.add(journeyTl)
      journeyWrapRef.current = journeyWrapperTl

      const transitionDuration = isMobileSetup ? 1.2 : 0.6
      const bookFlipWrapperTl = gsap.timeline()
      bookFlipWrapperTl.to(
        [journeyWrapper, bookFlipWrapper],
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
      bookFlipWrapRef.current = bookFlipWrapperTl

      const commentWrapperTl = commentTl
        ? gsap.timeline().add(commentTl)
        : gsap.timeline()
      commentWrapRef.current = commentWrapperTl

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: masterTrigger,
          start: "top top",
          end: `+=${totalScrollHeight}%`,
          pin: true,
          pinSpacing: true,
          scrub: isMobileSetup ? 1 : 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      masterTl.add(welcomeTl)
      masterTl.add(curtainWrapper)
      masterTl.add(journeyWrapperTl)
      masterTl.add(bookFlipWrapperTl)
      if (commentTl) masterTl.add(commentWrapperTl)

      masterTlRef.current = masterTl
    },
    { scope: mainRef, dependencies: [isLoaded] }
  )

  // 2) Patch saat theme berubah — tanpa kill master pin
  useEffect(() => {
    if (!isLoaded) return

    const cWrapper = curtainWrapRef.current
    const jWrapper = journeyWrapRef.current
    const bWrapper = bookFlipWrapRef.current
    const coWrapper = commentWrapRef.current

    if (
      !cWrapper ||
      !jWrapper ||
      !bWrapper ||
      !refs.curtainRef.current ||
      !refs.journeyRef.current ||
      !refs.bookFlipRef.current
    )
      return

    // Welcome tidak depend on theme, skip rebuild
    const savedC = cWrapper.progress()
    const savedJ = jWrapper.progress()
    const savedB = bWrapper.progress()
    const savedCo = coWrapper?.progress() ?? 0

    cWrapper.progress(0, true)
    jWrapper.progress(0, true)
    bWrapper.progress(0, true)
    coWrapper?.progress(0, true)

    cWrapper.clear()
    jWrapper.clear()
    bWrapper.clear()
    coWrapper?.clear()

    const journeyWrap = document.getElementById("journey-wrapper")
    const bookFlipWrap = document.getElementById("book-flip-wrapper")
    if (journeyWrap) gsap.set(journeyWrap, { clearProps: "all" })
    if (bookFlipWrap) gsap.set(bookFlipWrap, { clearProps: "all" })

    // Restore initial wrapper states tanpa willChange permanen
    if (journeyWrap) gsap.set(journeyWrap, { opacity: 0 })
    if (bookFlipWrap) gsap.set(bookFlipWrap, { opacity: 0, y: "100%" })

    const newCurtainTl = refs.curtainRef.current.getTimeline()
    const newJourneyTl = refs.journeyRef.current.getTimeline()
    const newBookFlipTl = refs.bookFlipRef.current.getTimeline()
    const newCommentTl = refs.commentRef.current?.getTimeline()

    cWrapper.add(newCurtainTl)

    jWrapper.to(journeyWrap, { opacity: 1, duration: 0.2 })
    jWrapper.add(newJourneyTl)

    if (coWrapper && newCommentTl) {
      coWrapper.add(newCommentTl)
      coWrapper.progress(savedCo, true)
    }

    const isMobileTheme =
      window.innerWidth < 768 ||
      (window.innerWidth <= 1024 && window.innerHeight > window.innerWidth)
    bWrapper.to(
      [journeyWrap, bookFlipWrap],
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

    cWrapper.progress(savedC, true)
    jWrapper.progress(savedJ, true)
    bWrapper.progress(savedB, true)

    // Refresh pin di frame berikutnya agar tidak bentrok dengan BookFlip spin (hemat jank)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [theme, isLoaded])

  return { masterTlRef }
}
