"use client"

import React, { useRef, useState } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import {
  WaxSeal,
  OrnamentalDivider,
  EnvelopeIllustration,
} from "@/components/Icon"

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════
   BANK ACCOUNT CARD
═══════════════════════════════════════════════ */

function BankAccountCard({
  bank,
  accountNumber,
  accountName,
  accent,
  textPrimary,
  textSecondary,
  textMuted,
  border,
  borderAccent,
  surface,
  isDark,
}: {
  bank: string
  accountNumber: string
  accountName: string
  accent: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  border: string
  borderAccent: string
  surface: string
  isDark: boolean
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="dg-card group relative flex flex-col items-center gap-3 px-8 py-7 text-center transition-all duration-300"
      style={{
        border: `1px solid ${borderAccent}`,
        borderRadius: "12px",
        boxShadow: isDark
          ? "0 8px 32px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "0 8px 32px -8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute left-6 right-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Corner ornaments */}
      <div
        className="absolute left-3 top-3 text-[8px] opacity-20"
        style={{ color: accent }}
      >
        ❧
      </div>
      <div
        className="absolute right-3 top-3 text-[8px] opacity-20"
        style={{ color: accent, transform: "scaleX(-1)" }}
      >
        ❧
      </div>

      {/* Bank name */}
      <p className="font-sans text-[9px] font-semibold tracking-[0.45em] text-muted uppercase">
        {bank}
      </p>

      {/* Account number */}
      <p
        className="font-signature font-bold tracking-[0.08em] text-muted dark:text-secondary"
        style={{
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
        }}
      >
        {accountNumber}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px w-8" style={{ background: borderAccent }} />
        <div
          className="h-1.5 w-1.5 rotate-45"
          style={{ background: accent, opacity: 0.6 }}
        />
        <div className="h-px w-8" style={{ background: borderAccent }} />
      </div>

      {/* Account name */}
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
        a.n. {accountName}
      </p>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="mt-2 flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-200"
        style={{
          border: `1px solid ${accent}`,
          color: copied ? "#ffffff" : accent,
          background: copied ? accent : "transparent",
          borderRadius: "6px",
        }}
      >
        {copied ? (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <path
                d="M1.5 5 L4 7.5 L8.5 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Tersalin
          </>
        ) : (
          <>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <rect
                x="3"
                y="3"
                width="6"
                height="6"
                rx="1"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M7 3 V2 a1 1 0 0 0-1-1 H2 a1 1 0 0 0-1 1 v4 a1 1 0 0 0 1 1 h1"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </svg>
            Salin Nomor
          </>
        )}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN DIGITAL GIFT COMPONENT
═══════════════════════════════════════════════ */

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)

  const accent = isDark ? "#A0280A" : "#8B6914"
  const accentLight = isDark ? "rgba(160,40,10,0.15)" : "rgba(139,105,20,0.1)"
  const accentGlow = isDark
    ? "radial-gradient(ellipse 70% 40% at 50% 40%, rgba(160,40,10,0.08), transparent)"
    : "radial-gradient(ellipse 70% 40% at 50% 40%, rgba(139,105,20,0.07), transparent)"
  const dot = isDark ? "rgba(160,40,10,0.05)" : "rgba(139,105,20,0.05)"
  const surface = isDark ? "#111111" : "#F9F5EE"
  const surface2 = isDark ? "#0E0E0E" : "#F4EFE6"
  const textPrimary = isDark ? "#FFFFFF" : "#1A1714"
  const textSecondary = isDark ? "#888888" : "#6B5F50"
  const textMuted = isDark ? "#444444" : "#A09080"
  const border = isDark ? "rgba(255,255,255,0.06)" : "rgba(139,105,20,0.12)"
  const borderAccent = isDark ? "rgba(160,40,10,0.3)" : "rgba(139,105,20,0.3)"

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        ".dg-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".dg-envelope",
          { opacity: 0, y: 24, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-message",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-ornament-1",
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
            transformOrigin: "center",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-cards-wrapper",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-card",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-closing",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className="dg-section relative w-full overflow-hidden"
    >
      {/* Dot texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1.2px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: accentGlow }}
      />

      <div className="dg-content relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-6">
        {/* ── Header ── */}
        <div className="dg-header flex flex-col items-center gap-3 text-center">
          <p
            className="dg-eyebrow font-sans text-[10px] font-semibold tracking-[0.55em] uppercase"
            style={{ color: textSecondary }}
          >
            Amplop Digital
          </p>
          <h2
            className="dg-title font-signature font-bold"
            style={{
              fontSize: "clamp(3rem, 10vw, 6rem)",
              color: textPrimary,
              lineHeight: 1,
            }}
          >
            Wedding Gift
          </h2>
        </div>

        {/* ── Envelope Illustration ── */}
        <div className="dg-envelope">
          <EnvelopeIllustration accent={accent} isDark={isDark} />
        </div>

        {/* ── Ornamental Divider ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider color={borderAccent} />
        </div>

        {/* ── Message Card ── */}
        <div
          className="dg-message relative w-full max-w-lg px-8 py-8 text-center md:px-12 md:py-10"
          style={{
            border: `1px solid ${border}`,
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 20px 50px -16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)"
              : "0 20px 50px -16px rgba(139,105,20,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Wax seal overlapping top */}
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2"
            style={{ zIndex: 10 }}
          >
            <WaxSeal accent={accent} isDark={isDark} />
          </div>

          {/* Names */}
          <p
            className="font-signature font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: textPrimary,
              lineHeight: 1.2,
              paddingTop: "16px",
            }}
          >
            Devi &amp; Adhim
          </p>

          {/* Inner ornament */}
          <div className="mx-auto my-4 flex items-center gap-3">
            <div
              className="h-px flex-1 max-w-12"
              style={{ background: borderAccent }}
            />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1 L7.5 4.5 L11 6 L7.5 7.5 L6 11 L4.5 7.5 L1 6 L4.5 4.5 Z"
                fill={accent}
                opacity="0.6"
              />
            </svg>
            <div
              className="h-px flex-1 max-w-12"
              style={{ background: borderAccent }}
            />
          </div>

          {/* Message */}
          <p
            className="mx-auto max-w-sm font-sans text-sm font-light leading-relaxed"
            style={{ color: textSecondary, lineHeight: 1.9 }}
          >
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah
            hati menerimanya.
          </p>
        </div>

        {/* ── Ornamental Divider ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider color={borderAccent} />
        </div>

        {/* ── Bank Account Cards ── */}
        <div className="dg-cards-wrapper grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          <BankAccountCard
            bank="Bank Central Asia"
            accountNumber="1234567890"
            accountName="Salman Adhim"
            accent={accent}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            border={border}
            borderAccent={borderAccent}
            surface={surface}
            isDark={isDark}
          />
          <BankAccountCard
            bank="Bank Mandiri"
            accountNumber="0987654321"
            accountName="Devi Yuliana"
            accent={accent}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            border={border}
            borderAccent={borderAccent}
            surface={surface}
            isDark={isDark}
          />
        </div>

        {/* ── Closing ── */}
        <div className="dg-closing flex flex-col items-center gap-4 text-center">
          <OrnamentalDivider color={borderAccent} size="small" />

          <p
            className="max-w-md font-sans text-sm font-light leading-relaxed italic"
            style={{ color: textSecondary, lineHeight: 2 }}
          >
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak,
            Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>

          <OrnamentalDivider color={borderAccent} size="small" />
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
