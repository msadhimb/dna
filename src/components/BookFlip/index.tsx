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
            force3D: true,
          })
          gsap.set(coverRef.current, {
            rotateY: 0,
            rotateX: 0,
            transformOrigin: "left center",
            force3D: true,
          })
          gsap.set(page1Ref.current, {
            rotateY: 0,
            rotateX: 0,
            transformOrigin: "left center",
            force3D: true,
          })
          gsap.set(shadowRef.current, { opacity: 0, scaleX: 0.4 })
          gsap.set(ribbonRef.current, { opacity: 1, y: 0 })
          gsap.set(shadowNodes, { opacity: 0 })

          const isDesktop = window.innerWidth >= 768

          tl.to(bookRef.current, {
            opacity: 1,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            y: 0,
            duration: 2,
            ease: "none",
          })
            .to(
              shadowRef.current,
              { opacity: 0.5, scaleX: 1, duration: 1.6, ease: "none" },
              "<"
            )
            .to(
              ribbonRef.current,
              { y: 24, opacity: 0, duration: 0.5, ease: "none" },
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
              ease: "none",
            })
              .to(
                coverRef.current,
                { rotateY: -180, duration: 1.2, ease: "none" },
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
                  ease: "none",
                },
                "-=0.4"
              )
          } else {
            // MOBILE: 2 Flips, Dynamic Journey Sequence
            tl.to(bookRef.current, {
              rotateY: -15,
              rotateX: 15,
              z: 200,
              x: "10%",
              duration: 1,
              ease: "none",
            })
              .to(
                coverRef.current,
                { rotateY: -180, duration: 1, ease: "none" },
                "<"
              )
              .to(
                [coverFrontShadowRef.current, coverBackShadowRef.current],
                { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 1 },
                "<"
              )
              .set(coverRef.current, { zIndex: 10 }, "<0.5")
              .to(
                bookRef.current,
                {
                  rotateY: 0,
                  rotateX: 0,
                  z: 100, // Zoom in on Date (Page 1 Front)
                  x: "0%",
                  duration: 0.8,
                  ease: "none",
                },
                "-=0.2"
              )
              .to({}, { duration: 0.6 }) // Pause to read date
              .to(bookRef.current, {
                rotateY: -15,
                rotateX: 15,
                z: 250, // Zoom closer during second flip
                x: "15%",
                duration: 1,
                ease: "none",
              })
              .to(
                page1Ref.current,
                { rotateY: -180, duration: 1, ease: "none" },
                "<"
              )
              .to(
                [page1FrontShadowRef.current, page1BackShadowRef.current],
                { opacity: 0.55, duration: 0.5, yoyo: true, repeat: 1 },
                "<"
              )
              .set(page1Ref.current, { zIndex: 30 }, "<0.5")
              .to(
                bookRef.current,
                {
                  rotateY: 0,
                  rotateX: 0,
                  z: 120, // Zoom in on Map (Page 2)
                  x: "0%",
                  duration: 0.8,
                  ease: "none",
                },
                "-=0.2"
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
          .set(page1Ref.current, { zIndex: 15 }, 0.3)
          .set(coverRef.current, { zIndex: 25 }, 0.4)
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
            [coverRef.current, page1Ref.current],
            {
              rotateY: (i, target) =>
                target === coverRef.current ? targetCoverRot : targetPage1Rot,
              duration: 0.6,
              ease: "power2.inOut",
              stagger: 0.1,
            },
            "reopen"
          )
          .add(() => {
            if (targetCoverRot < -10) gsap.set(coverRef.current, { zIndex: 10 })
          }, "reopen+=0.3")
          .add(() => {
            if (targetPage1Rot < -10) gsap.set(page1Ref.current, { zIndex: 30 })
          }, "reopen+=0.4")
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
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border bg-[#f7f2e8] px-7 py-9 text-center dark:bg-[#0f0f0f] border-border"
            )}
            style={{ zIndex: 5 }}
          >
            <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
            <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
            <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
              {locationLabel}
            </span>
            <span className="font-signature text-3xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
              {location}
            </span>

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.645103116751!2d106.6326327!3d-6.178238399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8d465b9f9c5%3A0x880e353b4abebf2f!2sDPD%20KNPI%20Tangerang!5e0!3m2!1sen!2sid!4v1786944064704!5m2!1sen!2sid"
              width="600"
              height="250"
              className="w-full max-w-sm overflow-hidden rounded-lg"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />

            <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
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
                "absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border bg-[#fdf8f0] px-7 py-9 text-center dark:bg-[#141414] border-border",

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
                  <span className="font-signature text-5xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                    {date}
                  </span>
                  <span className="font-serif text-[clamp(1.1rem,2.5vw,1.8rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                    9.00 AM - 3.00 PM
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
                "absolute inset-0 rounded-[8px_4px_4px_8px] border bg-[#f7f2e8] dark:bg-[#0f0f0f] border-border",
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
              pointerEvents: "none",
            }}
          >
            {/* Front of cover */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[4px_8px_8px_4px] border-2 px-7 py-8 text-center border-border",
                coverFront?.className
              )}
              style={{
                transform: "translateZ(1px)",
                background: coverGradient,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)",
                pointerEvents: "auto", // re-enable untuk front face
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
                pointerEvents: "auto",
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
                  <span className="font-serif text-[#1e1a14] dark:text-[#e0d8d0]">
                    9.00 AM - 3.00 PM
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

        {/* floor shadow */}
        <div
          ref={shadowRef}
          className="pointer-events-none mt-[-6px] h-[32px] w-[60%] origin-top"
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
