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
import Ornament from "./components/Ornament"
import CornerFlourishes from "./components/CornerFlourishes"
import Cover from "./components/Cover"
import useResponsive from "@/hooks/useResponsive"

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
  date: string
  location: string
  dateLabel?: string
  locationLabel?: string
  mapUrl?: string
  className?: string
  theme?: "light" | "dark"
  cover?: BookFlipLayer
  page?: BookFlipLayer
}

export const BookFlip = forwardRef<BookFlipRef, BookFlipProps>(
  (
    {
      width = "min(90vw, 420px)",
      height = "min(72vh, 600px)",
      date,
      location,
      dateLabel = "Hari Pernikahan",
      locationLabel = "Lokasi",
      mapUrl,
      className,
      theme,
      cover,
      page,
    },
    ref
  ) => {
    const coverFront = cover?.front
    const coverBack = cover?.back
    const pageFront = page?.front
    const pageBack = page?.back
    const defaultPageBack = null

    const { resolvedTheme } = useTheme()
    const { dist } = useResponsive()
    const isFirstRender = useRef(true)
    const sectionRef = useRef<HTMLDivElement>(null)
    const bookRef = useRef<HTMLDivElement>(null)
    const coverRef = useRef<HTMLDivElement>(null)
    const page1Ref = useRef<HTMLDivElement>(null)
    const shadowRef = useRef<HTMLDivElement>(null)
    const ribbonRef = useRef<HTMLDivElement>(null)
    const coverFrontShadowRef = useRef<HTMLDivElement>(null)
    const coverBackShadowRef = useRef<HTMLDivElement>(null)
    const page1FrontShadowRef = useRef<HTMLDivElement>(null)
    const page1BackShadowRef = useRef<HTMLDivElement>(null)

    const activeTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light")
    const isDark = activeTheme === "dark"
    const coverThemeIsGreen = !isDark
    const coverGradient = !coverThemeIsGreen
      ? "linear-gradient(160deg, #8a1f1a 0%, #5c130f 55%, #3d0c09 100%)"
      : "linear-gradient(160deg, #1c3d22 0%, #12271a 55%, #0a1810 100%)"
    const gold = "#e9cf7a"

    useImperativeHandle(
      ref,
      () => ({
        getTimeline: () => {
          const tl = gsap.timeline()
          if (!bookRef.current || !coverRef.current || !page1Ref.current)
            return tl

          const shadowNodes = [
            coverFrontShadowRef.current,
            coverBackShadowRef.current,
            page1FrontShadowRef.current,
            page1BackShadowRef.current,
          ].filter(Boolean) as HTMLDivElement[]

          gsap.set(bookRef.current, {
            rotateX: 68,
            rotateY: -10,
            rotateZ: 2,
            scale: 0.82,
            x: "0%",
            z: 0,
            y: 160,
            opacity: 0,
            transformOrigin: "center 80%",
          })
          gsap.set(coverRef.current, {
            rotateY: 0,
            rotateX: 0,
            transformOrigin: "left center",
          })
          gsap.set(page1Ref.current, {
            rotateY: 0,
            rotateX: 0,
            transformOrigin: "left center",
          })
          gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.4 })
          gsap.set(ribbonRef.current, { opacity: 1, y: 0 })
          gsap.set(shadowNodes, { opacity: 0 })

          const isDesktop = window.innerWidth >= 768
          // Reduce Z-depth on mobile to minimize compositing cost
          const zMultiplier = isDesktop ? 1 : 0.5

          tl.to(bookRef.current, {
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            y: 0,
            duration: 2,
            ease: "expo.out",
          })
            .to(
              shadowRef.current,
              { opacity: 0.5, scaleX: 1, duration: 1.6, ease: "power2.out" },
              "<"
            )
            .to(
              ribbonRef.current,
              { y: 24, opacity: 0, duration: 0.5, ease: "back.in(2)" },
              "-=0.5"
            )
            .to({}, { duration: 0.4 })

          if (isDesktop) {
            // DESKTOP: 1 Flip, Content split left and right
            tl.to(bookRef.current, {
              rotateY: -12,
              rotateX: 12,
              z: 150,
              scale: 1.05,
              x: "50%",
              duration: 1.2,
              ease: "power1.inOut",
            })
              .to(
                coverRef.current,
                { rotateY: -180, duration: 1.2, ease: "power2.inOut" },
                "<"
              )
              .to(
                [coverFrontShadowRef.current, coverBackShadowRef.current],
                { opacity: 0.55, duration: 0.6, yoyo: true, repeat: 1 },
                "<"
              )
              .set(coverRef.current, { zIndex: 10 }, "<0.6")
              .to(
                bookRef.current,
                {
                  rotateY: 0,
                  rotateX: 0,
                  z: 50,
                  scale: 1,
                  duration: 0.8,
                  ease: "power2.out",
                },
                "-=0.4"
              )
          } else {
            // MOBILE: simplified flip — less rotation, less Z-depth, shorter duration
            tl.to(bookRef.current, {
              rotateY: -8,
              rotateX: 6,
              z: 80 * zMultiplier,
              x: "5%",
              duration: 0.8,
              ease: "power1.inOut",
            })
              .to(
                coverRef.current,
                { rotateY: -180, duration: 0.8, ease: "power2.inOut" },
                "<"
              )
              .to(
                [coverFrontShadowRef.current, coverBackShadowRef.current],
                { opacity: 0.4, duration: 0.4, yoyo: true, repeat: 1 },
                "<"
              )
              .set(coverRef.current, { zIndex: 10 }, "<0.4")
              .to(
                bookRef.current,
                {
                  rotateY: 0,
                  rotateX: 0,
                  z: 40 * zMultiplier,
                  x: "0%",
                  duration: 0.6,
                  ease: "power2.out",
                },
                "-=0.2"
              )
              .to({}, { duration: 0.4 }) // pause to read date
              .to(bookRef.current, {
                rotateY: -8,
                rotateX: 6,
                z: 60 * zMultiplier,
                x: "8%",
                duration: 0.7,
                ease: "power1.inOut",
              })
              .to(
                page1Ref.current,
                { rotateY: -180, duration: 0.7, ease: "power2.inOut" },
                "<"
              )
              .to(
                [page1FrontShadowRef.current, page1BackShadowRef.current],
                { opacity: 0.4, duration: 0.35, yoyo: true, repeat: 1 },
                "<"
              )
              .set(page1Ref.current, { zIndex: 30 }, "<0.35")
              .to(
                bookRef.current,
                {
                  rotateY: 0,
                  rotateX: 0,
                  z: 50 * zMultiplier,
                  x: "0%",
                  duration: 0.5,
                  ease: "power2.out",
                },
                "-=0.1"
              )
          }

          return tl
        },
      }),
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
      const targetPage1Rot = gsap.getProperty(
        page1Ref.current,
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

      if (targetCoverRot < -10) {
        const tl = gsap.timeline()
        tl.to(
          [page1Ref.current, coverRef.current],
          {
            rotateY: 0,
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.1,
          },
          0
        )
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
          .to(
            [coverRef.current, page1Ref.current],
            {
              rotateY: (i, target) =>
                target === coverRef.current ? targetCoverRot : targetPage1Rot,
              duration: 0.6,
              ease: "power2.inOut",
              stagger: 0.1,
            },
            ">"
          )
          .to(
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
            "<"
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
          className="relative max-w-full"
          style={{
            width: dist(width, "min(85vw, 420px)"),
            height: dist(height, "min(70vh, 600px)"),
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border border-[#c9a227]/30 bg-[#f7f2e8] px-7 py-9 text-center dark:border-[#d4af37]/30 dark:bg-[#0f0f0f]"
            style={{ zIndex: 5 }}
          >
            <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
            <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
            <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
              {locationLabel}
            </span>
            <span className="font-signature text-[clamp(1.1rem,2.5vw,1.8rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
              {location}
            </span>
            {mapUrl ? (
              <div className="max-h-55 min-h-35 w-full flex-1 overflow-hidden rounded-md border border-[#c9a227]/30 dark:border-[#d4af37]/30">
                <iframe
                  src={mapUrl}
                  className={cn(
                    "block h-full w-full border-0",
                    isDark &&
                      "brightness-75 hue-rotate-180 invert-[0.9] saturate-50"
                  )}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${location}`}
                />
              </div>
            ) : (
              <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
            )}
          </div>

          {/* PAGE — flipping page (front & back configurable via `page` prop), mobile only */}
          <div
            ref={page1Ref}
            className="absolute inset-0 md:hidden"
            style={{
              zIndex: 15,
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border border-[#c9a227]/30 bg-[#fdf8f0] px-7 py-9 text-center dark:border-[#d4af37]/30 dark:bg-[#141414]",
                pageFront?.className
              )}
              style={{
                transform: "translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                ...pageFront?.style,
              }}
            >
              {pageFront?.content ?? (
                <>
                  <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
                  <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
                  <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
                    {dateLabel}
                  </span>
                  <span className="font-signature text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                    {date}
                  </span>
                  <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
                </>
              )}
              <div
                ref={page1FrontShadowRef}
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
              />
            </div>
            <div
              className={cn(
                "absolute inset-0 rounded-[8px_4px_4px_8px] border border-[#c9a227]/30 bg-[#f7f2e8] dark:border-[#d4af37]/30 dark:bg-[#0f0f0f]",
                pageBack?.className
              )}
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                ...pageBack?.style,
              }}
            >
              {pageBack?.content ?? defaultPageBack}
              <div
                ref={page1BackShadowRef}
                className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
              />
            </div>
          </div>

          {/* COVER — flipping page (front & back configurable via `cover` prop) */}
          <div
            ref={coverRef}
            className="absolute inset-0"
            style={{
              zIndex: 25,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Front of cover */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[4px_8px_8px_4px] border-2 px-7 py-8 text-center",
                coverFront?.className
              )}
              style={{
                transform: "translateZ(1px)",
                background: coverGradient,
                borderColor: `${gold}55`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)",
                ...coverFront?.style,
              }}
            >
              {coverFront?.content ?? (
                <Cover isDark={isDark} gold={gold} ribbonRef={ribbonRef} />
              )}

              <div
                ref={coverFrontShadowRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60"
              />
            </div>

            {/* Back of cover (inside cover) */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[8px_4px_4px_8px] border bg-[#fdf8f0] px-7 py-9 text-center dark:bg-[#141414]",
                coverBack?.className
              )}
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                borderColor: `${gold}30`,
                ...coverBack?.style,
              }}
            >
              {coverBack?.content ?? (
                <div className="hidden h-full w-full flex-col items-center justify-center gap-4 md:flex">
                  <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
                  <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
                  <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
                    {dateLabel}
                  </span>
                  <span className="font-signature text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                    {date}
                  </span>
                  <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
                </div>
              )}

              <div
                ref={coverBackShadowRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60"
              />
            </div>
          </div>

          {/* spine */}
          <div
            className="absolute top-[4px] bottom-[4px] left-0 w-[22px] origin-right -translate-x-[16px] -rotate-y-90"
            style={{
              zIndex: 4,
              background: !coverThemeIsGreen
                ? "linear-gradient(to right, #3d0c09, #8a1f1a)"
                : "linear-gradient(to right, #0a1810, #1c3d22)",
              boxShadow: "inset -4px 0 8px -2px rgba(0,0,0,0.6)",
            }}
          />

          <div
            className="absolute top-[6px] -right-[3px] bottom-[6px] w-[6px] -translate-z-[2px] rounded-[0_3px_3px_0]"
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

        {/* floor shadow */}
        <div
          ref={shadowRef}
          className="pointer-events-none mt-[-6px] h-[32px] w-[60%] origin-top blur-[10px]"
          style={{
            background: isDark
              ? "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 70%)"
              : "radial-gradient(ellipse at center, rgba(0,0,0,0.28), transparent 70%)",
          }}
        />
      </section>
    )
  }
)

export default BookFlip
