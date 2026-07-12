/* eslint-disable react/display-name */
"use client"

import React, { forwardRef, useRef, useImperativeHandle } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Ornament from "./components/Ornament"
import CornerFlourishes from "./components/CornerFlourishes"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

export interface BookFlipRef {
  getTimeline: () => gsap.core.Timeline
}

export interface BookFlipProps {
  width?: string
  height?: string
  date: string
  location: string
  dateLabel?: string
  locationLabel?: string
  /** "suami" -> merah (red) cover, "istri" -> hijau (green) cover, like the real Buku Nikah */
  bukuNikahType?: "suami" | "istri"
  coverTitle?: string
  coverSubtitle?: string
  monogram?: string
  mapUrl?: string
  className?: string
  theme?: "light" | "dark"
}

export const BookFlip = forwardRef<BookFlipRef, BookFlipProps>(
  (
    {
      width = "min(90vw, 400px)",
      height = "min(72vh, 560px)",
      date,
      location,
      dateLabel = "Hari Pernikahan",
      locationLabel = "Lokasi",
      bukuNikahType = "suami",
      coverTitle,
      coverSubtitle,
      monogram,
      mapUrl,
      className,
      theme,
    },
    ref
  ) => {
    const { resolvedTheme } = useTheme()
    const activeTheme = theme ?? (resolvedTheme === "dark" ? "dark" : "light")
    const isDark = activeTheme === "dark"
    const isSuami = bukuNikahType === "suami"

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
            .to(bookRef.current, {
              rotateY: -12,
              rotateX: 12,
              z: 100,
              x: () => (window.innerWidth >= 768 ? "50%" : "0%"),
              duration: 0.9,
              ease: "power1.inOut",
            })
            .to(
              coverRef.current,
              { rotateY: -90, duration: 0.9, ease: "power2.in" },
              "<"
            )
            .to(
              [coverFrontShadowRef.current, coverBackShadowRef.current],
              { opacity: 0.55, duration: 0.9, ease: "power1.in" },
              "<"
            )
            .to(coverRef.current, {
              rotateY: -180,
              duration: 0.9,
              ease: "power2.out",
            })
            .to(
              [coverFrontShadowRef.current, coverBackShadowRef.current],
              { opacity: 0, duration: 0.9, ease: "power1.out" },
              "<"
            )
            .to(
              bookRef.current,
              {
                rotateY: 0,
                rotateX: 0,
                z: 0,
                duration: 0.9,
                ease: "power2.out",
              },
              "<"
            )
            .to({}, { duration: 0.6 })
            .to(bookRef.current, {
              rotateY: -12,
              rotateX: 12,
              z: 100,
              x: () => (window.innerWidth >= 768 ? "50%" : "0%"),
              duration: 0.9,
              ease: "power1.inOut",
            })
            .to(
              page1Ref.current,
              { rotateY: -90, duration: 0.9, ease: "power2.in" },
              "<"
            )
            .to(
              [page1FrontShadowRef.current, page1BackShadowRef.current],
              { opacity: 0.55, duration: 0.9, ease: "power1.in" },
              "<"
            )
            .to(page1Ref.current, {
              rotateY: -180,
              duration: 0.9,
              ease: "power2.out",
            })
            .to(
              [page1FrontShadowRef.current, page1BackShadowRef.current],
              { opacity: 0, duration: 0.9, ease: "power1.out" },
              "<"
            )
            .to(
              bookRef.current,
              {
                rotateY: 0,
                rotateX: 0,
                z: 0,
                duration: 0.9,
                ease: "power2.out",
              },
              "<"
            )

          return tl
        },
      }),
      []
    )

    // Buku Nikah palette — merah (dark) / hijau (light)
    const coverThemeIsGreen = !isDark
    const coverGradient = !coverThemeIsGreen
      ? "linear-gradient(160deg, #8a1f1a 0%, #5c130f 55%, #3d0c09 100%)"
      : "linear-gradient(160deg, #1c3d22 0%, #12271a 55%, #0a1810 100%)"
    const gold = "#e9cf7a"
    const goldSoft = "#d9c78a"

    const isFirstRender = useRef(true)
    React.useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false
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
      const targetX = gsap.getProperty(bookRef.current, "x")

      if (targetCoverRot < -10) {
        // Animasi: Tutup dulu, lalu buka lagi
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
              x: 0,
              rotateX: 0,
              rotateY: 0,
              z: 0,
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
          "gsap-element relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#f0ebe0] dark:bg-[#1a1010]",
          isDark && "dark",
          className
        )}
        style={{ perspective: "1400px", perspectiveOrigin: "50% 38%" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? "#d4af37" : "#a08050"}22 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.07), transparent)"
              : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.07), transparent)",
          }}
        />

        <div
          ref={bookRef}
          className="relative"
          style={{
            width,
            height,
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          {/* PAGE 2 — bottom layer (map) */}
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
              <div className="max-h-[220px] min-h-[140px] w-full flex-1 overflow-hidden rounded-md border border-[#c9a227]/30 dark:border-[#d4af37]/30">
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

          {/* PAGE 1 — flipping page (front: date, back: inside texture) */}
          <div
            ref={page1Ref}
            className="absolute inset-0"
            style={{
              zIndex: 15,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-[4px_8px_8px_4px] border border-[#c9a227]/30 bg-[#fdf8f0] px-7 py-9 text-center dark:border-[#d4af37]/30 dark:bg-[#141414]"
              style={{
                transform: "translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
              <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
              <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
                {dateLabel}
              </span>
              <span className="font-signature text-[clamp(1.8rem,4vw,3rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                {date}
              </span>
              <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
              <div
                ref={page1FrontShadowRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60"
              />
            </div>
            <div
              className="absolute inset-0 rounded-[8px_4px_4px_8px] border border-[#c9a227]/30 bg-[#f7f2e8] dark:border-[#d4af37]/30 dark:bg-[#0f0f0f]"
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div
                ref={page1BackShadowRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60"
              />
            </div>
          </div>

          {/* COVER — flipping page, styled like the physical Buku Nikah */}
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
              className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[4px_8px_8px_4px] border-2 px-7 py-8 text-center"
              style={{
                transform: "translateZ(1px)",
                background: coverGradient,
                borderColor: `${gold}55`,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)",
              }}
            >
              {/* faux leather / linen texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)",
                }}
              />

              {/* title block */}
              <div className="relative z-10 mt-3 flex flex-col items-center gap-[2px]">
                <span
                  className="font-serif text-[2rem] font-bold"
                  style={{
                    color: gold,
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  BUKU NIKAH {isDark ? "SUAMI" : "ISTRI"}
                </span>
              </div>

              {/* emblem */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  style={{
                    filter:
                      "sepia(1) saturate(3) hue-rotate(5deg) brightness(1.05)",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src={"/asset/icon/garuda.png"}
                    alt="Emblem"
                    width={200}
                    height={200}
                  />
                </div>
              </div>

              {/* bottom block */}
              <div className="relative z-10 mb-2 flex flex-col items-center gap-[2px]">
                <span
                  className="font-serif text-[1.8rem] font-bold"
                  style={{
                    color: gold,
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  DEPARTEMEN AGAMA
                </span>
                <span
                  className="font-serif text-[1.8rem] font-bold"
                  style={{
                    color: gold,
                    textShadow: "0 1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  REPUBLIK INDONESIA
                </span>
              </div>

              {/* ribbon */}
              <div
                ref={ribbonRef}
                className="absolute bottom-[10px] flex items-end gap-[6px]"
              />

              <div
                ref={coverFrontShadowRef}
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/10 to-black/60"
              />
            </div>

            {/* Back of cover (inside cover) */}
            <div
              className="absolute inset-0 rounded-[8px_4px_4px_8px] border bg-[#fdf8f0] dark:bg-[#141414]"
              style={{
                transform: "rotateY(180deg) translateZ(1px)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                borderColor: `${gold}30`,
              }}
            >
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
