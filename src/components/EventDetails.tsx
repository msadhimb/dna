"use client"

import React, { useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// Reuse the same Ornament language as BookFlip
function Ornament({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 16"
      style={{
        width: "100px",
        height: "14px",
        color,
        transform: flip ? "rotate(180deg)" : undefined,
      }}
      fill="none"
    >
      <path d="M0 8 H44 M76 8 H120" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="8" r="3" fill="currentColor" />
      <path
        d="M48 8 C52 3,58 3,60 8 C62 3,68 3,72 8"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M48 8 C52 13,58 13,60 8 C62 13,68 13,72 8"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
}

function WideOrnament({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 12"
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "10px",
        color,
        transform: flip ? "rotate(180deg)" : undefined,
      }}
      fill="none"
    >
      <path d="M0 6 H70 M130 6 H200" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
      <path
        d="M75 6 L80 2 L85 6 L90 2 L95 6 L100 2 L105 6 L110 2 L115 6 L120 2 L125 6"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      <circle cx="100" cy="6" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
}

function CornerFlourish({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br"
  color: string
}) {
  const rot = { tl: "0deg", tr: "90deg", bl: "-90deg", br: "180deg" }
  const pos = {
    tl: { top: 20, left: 20 },
    tr: { top: 20, right: 20 },
    bl: { bottom: 20, left: 20 },
    br: { bottom: 20, right: 20 },
  }
  return (
    <svg
      viewBox="0 0 20 20"
      style={{
        width: 20,
        height: 20,
        color,
        position: "absolute",
        transform: `rotate(${rot[position]})`,
        opacity: 0.35,
        ...pos[position],
      }}
      fill="none"
    >
      <path d="M2 18 L2 2 L18 2" stroke="currentColor" strokeWidth="0.8" />
      <path d="M2 8 C2 4,6 2,8 2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

export default function EventDetails() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Exact same token system as BookFlip
  const accent = isDark ? "#832004" : "#c9a227"
  const label = isDark ? "#7a6060" : "#9a865a"
  const body = isDark ? "#e0d8d0" : "#1e1a14"
  const bg = isDark ? "#080808" : "#f0ebe0"
  const dot = isDark ? "#83200415" : "#a0805022"
  const borderColor = isDark ? "rgba(131,32,4,0.25)" : "rgba(201,162,39,0.25)"
  const divider = isDark ? "rgba(131,32,4,0.18)" : "rgba(201,162,39,0.18)"
  const mapFilter = isDark
    ? "invert(0.9) hue-rotate(180deg) saturate(0.7) brightness(0.85)"
    : "none"

  const sectionRef = useRef<HTMLElement>(null)
  const topLabelRef = useRef<HTMLParagraphElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const orn1Ref = useRef<HTMLDivElement>(null)
  const dateBlockRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const locationBlockRef = useRef<HTMLDivElement>(null)
  const mapBlockRef = useRef<HTMLDivElement>(null)
  const orn2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = [
        topLabelRef.current,
        titleRef.current,
        orn1Ref.current,
        dateBlockRef.current,
        dividerRef.current,
        locationBlockRef.current,
        mapBlockRef.current,
        orn2Ref.current,
      ].filter(Boolean)

      gsap.fromTo(
        elements,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background"
      style={{ minHeight: "100vh" }}
    >
      {/* Dot texture — identical to BookFlip */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(131,32,4,0.05), transparent)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.05), transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-6 py-24 text-center md:gap-10 md:py-32">
        {/* ── Label ── */}
        <p
          ref={topLabelRef}
          style={{
            fontFamily: "serif",
            fontSize: "10px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: label,
          }}
        >
          Hari Bahagia Kami
        </p>

        {/* ── Title ── */}
        <h2
          ref={titleRef}
          className="font-signature"
          style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)", color: body, lineHeight: 1.1 }}
        >
          Waktu & Tempat
        </h2>

        {/* ── Top wide ornament ── */}
        <div ref={orn1Ref} className="flex justify-center">
          <WideOrnament color={accent} />
        </div>

        {/* ── Date Block ── */}
        <div
          ref={dateBlockRef}
          className="relative flex w-full max-w-sm flex-col items-center gap-5 px-10 py-10"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <CornerFlourish position="tl" color={accent} />
          <CornerFlourish position="tr" color={accent} />
          <CornerFlourish position="bl" color={accent} />
          <CornerFlourish position="br" color={accent} />

          <Ornament color={accent} />

          <p
            style={{
              fontFamily: "serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: label,
            }}
          >
            Tanggal Pernikahan
          </p>

          <h3
            className="font-signature"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: body,
              lineHeight: 1.2,
            }}
          >
            12 . 12 . 2026
          </h3>

          <div style={{ height: "1px", width: "60px", background: divider }} />

          <p
            style={{
              fontFamily: "serif",
              fontSize: "11px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: label,
            }}
          >
            Sabtu &nbsp;·&nbsp; 09:00 WIB
          </p>

          <Ornament color={accent} flip />
        </div>

        {/* ── Divider with heart ── */}
        <div
          ref={dividerRef}
          className="flex items-center gap-4"
          style={{ color: accent, opacity: 0.5 }}
        >
          <div style={{ height: "1px", width: "48px", background: accent, opacity: 0.4 }} />
          <div style={{ width: "6px", height: "6px", transform: "rotate(45deg)", border: `1px solid ${accent}` }} />
          <div style={{ height: "1px", width: "48px", background: accent, opacity: 0.4 }} />
        </div>

        {/* ── Location Block ── */}
        <div
          ref={locationBlockRef}
          className="relative flex w-full max-w-sm flex-col items-center gap-5 px-10 py-10"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <CornerFlourish position="tl" color={accent} />
          <CornerFlourish position="tr" color={accent} />
          <CornerFlourish position="bl" color={accent} />
          <CornerFlourish position="br" color={accent} />

          <Ornament color={accent} />

          <p
            style={{
              fontFamily: "serif",
              fontSize: "10px",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: label,
            }}
          >
            Lokasi
          </p>

          <h3
            className="font-signature"
            style={{
              fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)",
              color: body,
              lineHeight: 1.3,
            }}
          >
            Grand Ballroom, Semarang
          </h3>

          <div style={{ height: "1px", width: "60px", background: divider }} />

          <p
            style={{
              fontFamily: "serif",
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: label,
              lineHeight: 1.8,
            }}
          >
            Jl. Pandanaran No. 123
            <br />
            Semarang, Jawa Tengah
          </p>

          <Ornament color={accent} flip />
        </div>

        {/* ── Map ── */}
        <div
          ref={mapBlockRef}
          className="w-full max-w-sm overflow-hidden"
          style={{
            border: `1px solid ${borderColor}`,
            height: "260px",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d110.4!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b4d3f0d024d%3A0x1730a2f9788fa517!2sGrand%20Ballroom%20Semarang!5e0!3m2!1sen!2sid!4v1"
            width="100%"
            height="100%"
            style={{ border: 0, display: "block", filter: mapFilter }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Grand Ballroom Semarang"
          />
        </div>

        {/* ── Bottom wide ornament ── */}
        <div ref={orn2Ref} className="flex justify-center">
          <WideOrnament color={accent} flip />
        </div>
      </div>
    </section>
  )
}
