"use client"

import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Cover from "./components/Cover"
import useResponsive from "@/hooks/useResponsive"
import BookPages from "./components/BookPages"
import { getTimeline } from "./helper/getTimeline"
import { defaultPages } from "./helper/defaultPages"

gsap.registerPlugin(ScrollTrigger)

export interface BookFlipRef {
  getTimeline: () => gsap.core.Timeline
}

export interface BookFlipFace {
  content?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export interface BookFlipLayer {
  front?: BookFlipFace
  back?: BookFlipFace
}

export interface BookFlipProps {
  width?: string
  height?: string
  className?: string
  theme?: "light" | "dark"
  cover?: BookFlipLayer
  pages?: React.ReactNode[]
}

export const BookFlip = forwardRef<BookFlipRef, BookFlipProps>(
  (
    {
      width = "min(90vw, 420px)",
      height = "min(72vh, 600px)",
      className,
      theme,
      cover,
      pages: pagesProp,
    },
    ref
  ) => {
    const coverFront = cover?.front
    const coverBack = cover?.back

    const { resolvedTheme } = useTheme()
    const { dist } = useResponsive()
    const isFirstRender = useRef(true)
    const sectionRef = useRef<HTMLDivElement>(null)
    const bookRef = useRef<HTMLDivElement>(null)
    const coverRef = useRef<HTMLDivElement>(null)
    const pageRefs = useRef<(HTMLDivElement | null)[]>([])
    const shadowRef = useRef<HTMLDivElement>(null)
    const ribbonRef = useRef<HTMLDivElement>(null)
    const coverFrontShadowRef = useRef<HTMLDivElement>(null)
    const coverBackShadowRef = useRef<HTMLDivElement>(null)
    const pageFrontShadowRefs = useRef<(HTMLDivElement | null)[]>([])
    const pageBackShadowRefs = useRef<(HTMLDivElement | null)[]>([])
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 768

    const activeTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light")
    const isDark = activeTheme === "dark"
    const coverThemeIsGreen = !isDark
    const coverGradient = !coverThemeIsGreen
      ? "linear-gradient(160deg, #8a1f1a 0%, #5c130f 55%, #3d0c09 100%)"
      : "linear-gradient(160deg, #1c3d22 0%, #12271a 55%, #0a1810 100%)"
    const gold = "#e9cf7a"

    const resolvedPages: any =
      pagesProp && pagesProp.length > 0
        ? pagesProp
        : defaultPages({
            isDark: isDark,
          })

    // Pair pages into spreads: [[index0, index1], [index2, index3], ...]
    const desktopSpreads = []
    for (let i = 0; i < resolvedPages.length; i += 2) {
      desktopSpreads.push([resolvedPages[i], resolvedPages[i + 1] ?? null])
    }

    useImperativeHandle(
      ref,
      () =>
        ({
          getTimeline: getTimeline({
            gsap,
            pageRefs,
            coverRef,
            bookRef,
            shadowRef,
            ribbonRef,
            coverFrontShadowRef,
            coverBackShadowRef,
            pageFrontShadowRefs,
            pageBackShadowRefs,
          }),
        }) as any,
      []
    )

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }

      const bookFlipWrapper = sectionRef.current?.closest("#book-flip-wrapper")
      const wrapperOpacity = bookFlipWrapper
        ? parseFloat(
            (bookFlipWrapper as HTMLElement).style.opacity ||
              getComputedStyle(bookFlipWrapper as HTMLElement).opacity
          )
        : 1
      if (wrapperOpacity < 0.5) {
        return
      }

      const targetCoverRot = gsap.getProperty(
        coverRef.current,
        "rotateY"
      ) as number

      const targetX = gsap.getProperty(bookRef.current, "x") + "%"
      const targetZ = gsap.getProperty(bookRef.current, "z")
      const targetRotX = gsap.getProperty(bookRef.current, "rotateX")
      let currentRotY = gsap.getProperty(bookRef.current, "rotateY") as number
      currentRotY = currentRotY % 360
      if (currentRotY > 180) currentRotY -= 360
      if (currentRotY < -180) currentRotY += 360
      gsap.set(bookRef.current, { rotateY: currentRotY })

      const targetRotY = currentRotY
      const targetScale = gsap.getProperty(bookRef.current, "scale")

      const validPageEls = pageRefs.current.filter(Boolean) as HTMLDivElement[]
      const targetPageRots = validPageEls.map(
        (el) => gsap.getProperty(el, "rotateY") as number
      )
      const anyFlipped =
        targetCoverRot < -10 || targetPageRots.some((r) => r < -10)

      if (anyFlipped) {
        const tl = gsap.timeline()
        tl.to(
          [...validPageEls, coverRef.current],
          {
            rotateY: 0,
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.1,
          },
          0
        )
        validPageEls.forEach((el, i) => {
          tl.set(el, { zIndex: 15 + (validPageEls.length - 1 - i) * 5 }, 0.3)
        })
        tl.set(coverRef.current, { zIndex: 25 }, 0.4)
          .to(
            bookRef.current,
            {
              x: "0%",
              rotateX: 0,
              rotateY: 0,
              z: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.inOut",
            },
            0
          )
          .to(
            bookRef.current,
            {
              rotateY: "+=360",
              duration: 1.0,
              ease: "power2.inOut",
            },
            ">"
          )
          .addLabel("reopen", ">")
          .to(
            [coverRef.current, ...validPageEls],
            {
              rotateY: (i: number, target: HTMLDivElement) => {
                if (target === coverRef.current) return targetCoverRot
                const pageIdx = validPageEls.indexOf(target)
                return pageIdx >= 0 ? targetPageRots[pageIdx] : 0
              },
              duration: 0.6,
              ease: "power2.inOut",
              stagger: 0.1,
            },
            "reopen"
          )
          .add(() => {
            if (targetCoverRot < -10) gsap.set(coverRef.current, { zIndex: 10 })
          }, "reopen+=0.3")

        validPageEls.forEach((el, i) => {
          tl.add(() => {
            if (targetPageRots[i] < -10)
              gsap.set(el, { zIndex: 30 + (validPageEls.length - 1 - i) * 5 })
          }, "reopen+=0.4")
        })
        tl.to(
          bookRef.current,
          {
            x: targetX,
            z: targetZ,
            rotateX: targetRotX,
            rotateY: targetRotY + 360,
            scale: targetScale,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "reopen"
        )
      } else {
        if (bookRef.current) {
          gsap.to(bookRef.current, {
            rotateY: "+=360",
            duration: 1.2,
            ease: "power2.inOut",
          })
        }
      }
    }, [isDark])

    return (
      <section
        ref={sectionRef}
        className={cn(
          "gsap-element relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
          isDark && "dark",
          className
        )}
        style={{ perspective: "1400px", perspectiveOrigin: "50% 38%" }}
      >
        <div
          ref={bookRef}
          className="relative max-w-full pointer-events-auto"
          style={{
            width: dist(width, "min(85vw, 420px)"),
            height: dist(height, "min(70vh, 600px)"),
            transformStyle: "preserve-3d",
          }}
        >
          {/* PAGES — flipping pages (configurable via `pages` prop) */}
          <BookPages
            isDesktop={isDesktop}
            resolvedPages={resolvedPages}
            pageRefs={pageRefs}
            pageFrontShadowRefs={pageFrontShadowRefs}
            pageBackShadowRefs={pageBackShadowRefs}
          />

          {/* COVER — flipping page (front & back configurable via `cover` prop) */}
          <Cover
            coverFront={coverFront}
            coverBack={coverBack}
            coverRef={coverRef}
            coverFrontShadowRef={coverFrontShadowRef}
            coverBackShadowRef={coverBackShadowRef}
            isDesktop={isDesktop}
            resolvedPages={resolvedPages}
            gold={gold}
            ribbonRef={ribbonRef}
            isDark={isDark}
            coverGradient={coverGradient}
          />

          <div
            className="absolute top-1.5 -right-0.75 bottom-1.5 w-1.5 -translate-z-0.5 rounded-[0_3px_3px_0]"
            style={{
              zIndex: 3,
              background: isDark
                ? "repeating-linear-gradient(to bottom, #2a2418, #2a2418 2px, #15110a 2px, #15110a 3px)"
                : "repeating-linear-gradient(to bottom, #f4ecd8, #f4ecd8 2px, #cbb98a 2px, #cbb98a 3px)",
              boxShadow: isDark
                ? "2px 0 6px -2px rgba(0,0,0,0.8)"
                : "2px 0 6px -2px rgba(0,0,0,0.28)",
            }}
          />
        </div>
      </section>
    )
  }
)

export default BookFlip
