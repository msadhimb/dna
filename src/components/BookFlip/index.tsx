/* eslint-disable react/display-name */
"use client"

import React, { forwardRef, useMemo, useRef, useImperativeHandle } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import Ornament from "./components/Ornament"
import CornerFlourishes from "./components/CornerFlourishes"
import WideOrnament from "./components/WideOrnaments"
import RibbonStrap from "./components/RibbonStrap"

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
  coverTitle?: string
  coverSubtitle?: string
  monogram?: string
  mapUrl?: string
  className?: string
  theme?: "light" | "dark"
}

const T = {
  light: {
    bg: "#f0ebe0",
    dot: "#a08050",
    pageBg: "#fdf8f0",
    pageBg2: "#f7f2e8",
    border: "rgba(201,162,39,0.3)",
    divider: "rgba(201,162,39,0.2)",
    label: "#9a865a",
    body: "#1e1a14",
    ornament: "#c9a227",
    ribbon: "#b8902a",
    coverA: "#2e3d2c",
    coverB: "#111a10",
    coverBorder: "rgba(201,162,39,0.55)",
    coverInner: "rgba(201,162,39,0.28)",
    coverTitle: "#d9c78a",
    coverSub: "#b0a882",
    monoBorder: "#c9a227",
    monoText: "#eddfa8",
    monoGlow: "none",
    insideCover: "#ede0c0",
    spine: "#1a2b18",
    spineShadow: "rgba(0,0,0,0.28)",
    bookShadow: "0 40px 80px -20px rgba(0,0,0,0.35)",
    edgeLight: "#f4ecd8",
    edgeDark: "#cbb98a",
  },
  dark: {
    bg: "#080808",
    dot: "#832004",
    pageBg: "#0e0e0e",
    pageBg2: "#0a0808",
    border: "rgba(131,32,4,0.3)",
    divider: "rgba(131,32,4,0.2)",
    label: "#7a6060",
    body: "#e0d8d0",
    ornament: "#832004",
    ribbon: "#9a2a0a",
    coverA: "#0e0e0e",
    coverB: "#050505",
    coverBorder: "rgba(131,32,4,0.5)",
    coverInner: "rgba(131,32,4,0.22)",
    coverTitle: "#9a7070",
    coverSub: "#7a5a5a",
    monoBorder: "#832004",
    monoText: "#c8b0a0",
    monoGlow: "0 0 28px rgba(131,32,4,0.55)",
    insideCover: "#0c0808",
    spine: "#050505",
    spineShadow: "rgba(0,0,0,0.8)",
    bookShadow: "0 40px 100px -20px rgba(131,32,4,0.25)",
    edgeLight: "#2a1c18",
    edgeDark: "#150c0a",
  },
} as const

export const BookFlip = forwardRef<BookFlipRef, BookFlipProps>(
  (
    {
      width = "min(88vw, 700px)",
      height = "min(72vh, 560px)",
      date,
      location,
      dateLabel = "Hari Pernikahan",
      locationLabel = "Lokasi",
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
    const t = useMemo(() => T[activeTheme], [activeTheme])

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

          // ── INITIAL STATE ──────────────────────────
          gsap.set(bookRef.current, {
            rotateX: 68,
            rotateY: -10,
            rotateZ: 2,
            scale: 0.82,
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

          // ── PHASE 0: BOOK RISES (3D tilt → upright) ─
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
              {
                opacity: 0.5,
                scaleX: 1,
                duration: 1.6,
                ease: "power2.out",
              },
              "<"
            )

            // ── PHASE 0b: Ribbon breaks ───────────────
            .to(
              ribbonRef.current,
              {
                y: 24,
                opacity: 0,
                duration: 0.5,
                ease: "back.in(2)",
              },
              "-=0.5"
            )

            // pause/hold
            .to({}, { duration: 0.4 })

            // ── PHASE 1: COVER FLIPS (reveals Page 1) ──
            // Split into two half-turns so the page arcs (rotateX bulge)
            // instead of rotating flatly on a single axis — much more
            // convincing paper physics + parallax.
            .to(bookRef.current, {
              rotateY: -8,
              duration: 0.5,
              ease: "power1.out",
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
                duration: 0.6,
                ease: "elastic.out(1, 0.75)",
              },
              "-=0.6"
            )

            // pause/hold between pages
            .to({}, { duration: 0.6 })

            // ── PHASE 2: PAGE 1 FLIPS (reveals Page 2) ──
            .to(bookRef.current, {
              rotateY: -8,
              duration: 0.5,
              ease: "power1.out",
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
                duration: 0.6,
                ease: "elastic.out(1, 0.75)",
              },
              "-=0.6"
            )

          return tl
        },
      }),
      [theme, activeTheme]
    )

    const pageStyle: React.CSSProperties = useMemo(
      () => ({
        position: "absolute",
        inset: 0,
        borderRadius: "4px 8px 8px 4px",
        border: `1px solid ${t.border}`,
        background: t.pageBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "36px 28px",
        textAlign: "center",
        overflow: "hidden",
      }),
      [t]
    )

    const foldShadowStyle: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.68) 100%)",
      pointerEvents: "none",
    }

    return (
      <section
        ref={sectionRef}
        className={cn(
          "gsap-element relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
          className
        )}
        style={{
          background: t.bg,
          perspective: "2200px",
          perspectiveOrigin: "50% 38%",
        }}
      >
        {/* dot texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${t.dot}22 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              activeTheme === "dark"
                ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(131,32,4,0.07), transparent)"
                : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.07), transparent)",
          }}
        />

        {/* Book */}
        <div
          ref={bookRef}
          style={{
            width,
            height,
            position: "relative",
            transformStyle: "preserve-3d",
            filter: `drop-shadow(${t.bookShadow})`,
          }}
        >
          {/* ── PAGE 2 (bottom layer — map) ── */}
          <div style={{ ...pageStyle, zIndex: 5, background: t.pageBg2 }}>
            <CornerFlourishes color={t.ornament} />
            <Ornament color={t.ornament} />
            <span
              style={{
                fontFamily: "serif",
                fontSize: "10px",
                letterSpacing: "0.4em",
                textTransform: "uppercase",
                color: t.label,
              }}
            >
              {locationLabel}
            </span>
            <span
              style={{
                fontFamily: "var(--font-signature, cursive)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
                color: t.body,
                lineHeight: 1.3,
              }}
            >
              {location}
            </span>
            {mapUrl ? (
              <div
                style={{
                  width: "100%",
                  flex: 1,
                  minHeight: "140px",
                  maxHeight: "220px",
                  borderRadius: "6px",
                  overflow: "hidden",
                  border: `1px solid ${t.border}`,
                }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    display: "block",
                    filter:
                      activeTheme === "dark"
                        ? "invert(0.9) hue-rotate(180deg) saturate(0.7) brightness(0.85)"
                        : "none",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${location}`}
                />
              </div>
            ) : (
              <Ornament color={t.ornament} flip />
            )}
          </div>

          {/* ── PAGE 1 — flipping page (front: date, back: inside texture) ── */}
          <div
            ref={page1Ref}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 15,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front of page 1 */}
            <div
              style={{
                ...pageStyle,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <CornerFlourishes color={t.ornament} />
              <Ornament color={t.ornament} />
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "10px",
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: t.label,
                }}
              >
                {dateLabel}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-signature, cursive)",
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  color: t.body,
                  lineHeight: 1.2,
                }}
              >
                {date}
              </span>
              <Ornament color={t.ornament} flip />
              <div ref={page1FrontShadowRef} style={foldShadowStyle} />
            </div>
            {/* Back of page 1 (visible mid-flip) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "8px 4px 4px 8px",
                background: t.pageBg2,
                border: `1px solid ${t.border}`,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div ref={page1BackShadowRef} style={foldShadowStyle} />
            </div>
          </div>

          {/* ── COVER — flipping page (front: cover design, back: inside cover) ── */}
          <div
            ref={coverRef}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 25,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front of cover */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "4px 8px 8px 4px",
                background: `linear-gradient(135deg, ${t.coverA} 0%, ${t.coverB} 100%)`,
                border: `1px solid ${t.coverBorder}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                padding: "40px 32px",
                textAlign: "center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                overflow: "hidden",
              }}
            >
              {/* foil texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `repeating-linear-gradient(45deg, transparent, transparent 3px, ${t.coverBorder.replace("0.55", "0.04")} 3px, ${t.coverBorder.replace("0.55", "0.04")} 6px)`,
                  pointerEvents: "none",
                }}
              />
              {/* inner border frames */}
              <div
                style={{
                  position: "absolute",
                  inset: "14px",
                  border: `1px solid ${t.coverInner}`,
                  borderRadius: "4px",
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: "22px",
                  border: `1px solid ${t.coverInner.replace("0.28", "0.12")}`,
                  borderRadius: "2px",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "absolute", top: "28px", width: "55%" }}>
                <WideOrnament color={t.ornament} />
              </div>

              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "9px",
                  letterSpacing: "0.6em",
                  textTransform: "uppercase",
                  color: t.coverTitle,
                  marginTop: "24px",
                }}
              >
                {coverTitle}
              </span>

              {/* monogram */}
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  border: `1.5px solid ${t.monoBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: t.monoText,
                  boxShadow: t.monoGlow,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "-6px",
                    borderRadius: "50%",
                    border: `1px solid ${t.monoBorder}33`,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-signature, cursive)",
                    fontSize: "1.5rem",
                  }}
                >
                  {monogram}
                </span>
              </div>

              {coverSubtitle && (
                <span
                  style={{
                    fontFamily: "serif",
                    fontSize: "10px",
                    letterSpacing: "0.35em",
                    color: t.coverSub,
                    maxWidth: "65%",
                  }}
                >
                  {coverSubtitle}
                </span>
              )}

              <div
                style={{ position: "absolute", bottom: "28px", width: "55%" }}
              >
                <WideOrnament color={t.ornament} flip />
              </div>

              {/* ribbon */}
              <div
                ref={ribbonRef}
                style={{
                  position: "absolute",
                  bottom: "44px",
                  display: "flex",
                  gap: "6px",
                  alignItems: "flex-end",
                }}
              >
                <RibbonStrap color={t.ribbon} />
                <RibbonStrap color={t.ribbon} />
              </div>

              <div ref={coverFrontShadowRef} style={foldShadowStyle} />
            </div>

            {/* Back of cover (inside cover) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "8px 4px 4px 8px",
                background: t.insideCover,
                border: `1px solid ${t.coverInner}`,
                transform: "rotateY(180deg)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div ref={coverBackShadowRef} style={foldShadowStyle} />
            </div>
          </div>

          {/* spine */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "4px",
              bottom: "4px",
              width: "22px",
              background: `linear-gradient(to right, ${t.spine}, ${t.coverA})`,
              boxShadow: `inset -4px 0 8px -2px ${t.spineShadow}`,
              transform: "translateX(-16px) rotateY(-90deg)",
              transformOrigin: "right center",
              zIndex: 4,
            }}
          />

          <div
            style={{
              position: "absolute",
              right: "-3px",
              top: "6px",
              bottom: "6px",
              width: "6px",
              zIndex: 3,
              borderRadius: "0 3px 3px 0",
              background: `repeating-linear-gradient(to bottom, ${t.edgeLight}, ${t.edgeLight} 2px, ${t.edgeDark} 2px, ${t.edgeDark} 3px)`,
              boxShadow: `2px 0 6px -2px ${t.spineShadow}`,
              transform: "translateZ(-2px)",
            }}
          />
        </div>

        {/* floor shadow */}
        <div
          ref={shadowRef}
          style={{
            width: "60%",
            height: "32px",
            marginTop: "-6px",
            background: `radial-gradient(ellipse at center, ${t.spineShadow}, transparent 70%)`,
            filter: "blur(10px)",
            transformOrigin: "top center",
            pointerEvents: "none",
          }}
        />
      </section>
    )
  }
)

export default BookFlip
