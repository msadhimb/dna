"use client"

import React, { useRef, useState } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)

  const accent = isDark ? "#A0280A" : "#8B6914"
  const dot = isDark ? "rgba(160,40,10,0.06)" : "rgba(139,105,20,0.06)"
  const surface = isDark ? "#0A0A0A" : "#F8F8F8"
  const textPrimary = isDark ? "#FFFFFF" : "#111111"
  const textSecondary = isDark ? "#888888" : "#555555"
  const textMuted = isDark ? "#444444" : "#AAAAAA"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const borderAccent = isDark ? "rgba(160,40,10,0.25)" : "rgba(139,105,20,0.25)"
  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(160,40,10,0.06), transparent)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,105,20,0.06), transparent)"

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        ".dg-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      )
        .fromTo(
          ".dg-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-divider",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.inOut",
            transformOrigin: "center",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-invite-card",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".dg-card",
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-closing",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
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
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: bgGradient }}
      />

      <div className="dg-content relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-12 px-6 py-24 md:gap-16 md:py-36">
        {/* ── Header ── */}
        <div className="dg-header flex flex-col items-center gap-4 text-center">
          <p
            className="dg-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase"
            style={{ color: textSecondary }}
          >
            Amplop Digital
          </p>
          <h2
            className="dg-title font-signature font-bold"
            style={{
              fontSize: "clamp(3rem, 9vw, 5.5rem)",
              color: textPrimary,
              lineHeight: 1,
            }}
          >
            Wedding Gift
          </h2>
          <div className="dg-divider h-px w-full max-w-xs" style={{ background: borderAccent }} />
        </div>

        {/* ── Invitation letter card ── */}
        <div
          className="dg-invite-card relative w-full max-w-2xl px-8 py-10 text-center md:px-12 md:py-12"
          style={{
            background: surface,
            border: `1px solid ${borderAccent}`,
            borderRadius: "20px",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          <p
            className="font-signature font-bold"
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: textPrimary,
              lineHeight: 1.3,
            }}
          >
            Devi &amp; Adhim
          </p>

          <div className="mx-auto my-5 h-px w-12" style={{ background: borderAccent }} />

          <p
            className="mx-auto max-w-sm font-sans text-sm font-medium leading-relaxed"
            style={{ color: textSecondary, lineHeight: 2 }}
          >
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah hati menerimanya.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="dg-divider h-px w-full max-w-xs" style={{ background: borderAccent }} />

        {/* ── Bank account cards ── */}
        <div className="flex w-full flex-col gap-5 md:flex-row md:gap-6">
          <BankAccountCard
            bank="Bank Central Asia"
            accountNumber="1234567890"
            accountName="Salman Adhim"
            accent={accent}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            borderAccent={borderAccent}
            surface={surface}
          />
          <BankAccountCard
            bank="Bank Mandiri"
            accountNumber="0987654321"
            accountName="Devi Yuliana"
            accent={accent}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
            borderAccent={borderAccent}
            surface={surface}
          />
        </div>

        {/* ── Closing ── */}
        <div className="dg-closing flex flex-col items-center gap-4 text-center">
          <div className="h-px w-24" style={{ background: borderAccent }} />

          <p
            className="max-w-lg font-sans text-sm font-medium leading-relaxed italic"
            style={{ color: textSecondary, lineHeight: 2 }}
          >
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak, Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>

          <p
            className="font-signature font-bold"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: textPrimary }}
          >
            Devi &amp; Adhim
          </p>

          <div className="h-px w-24" style={{ background: borderAccent }} />
        </div>
      </div>
    </section>
  )
}

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
  borderAccent,
  surface,
}: {
  bank: string
  accountNumber: string
  accountName: string
  accent: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  borderAccent: string
  surface: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="dg-card group relative flex flex-col items-center gap-4 px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1"
      style={{
        background: surface,
        border: `1px solid ${borderAccent}`,
        borderRadius: "16px",
        boxShadow:
          "0 10px 40px -10px rgba(0,0,0,0.15)",
      }}
    >
      {/* Bank name */}
      <p
        className="font-sans text-[10px] font-semibold tracking-[0.5em] uppercase"
        style={{ color: textSecondary }}
      >
        {bank}
      </p>

      {/* Account number */}
      <p
        className="font-signature font-bold"
        style={{
          fontSize: "clamp(1.4rem, 3.5vw, 2rem)",
          color: textPrimary,
          letterSpacing: "0.06em",
        }}
      >
        {accountNumber}
      </p>

      {/* Divider */}
      <div className="h-px w-12" style={{ background: borderAccent }} />

      {/* Account name */}
      <p
        className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase"
        style={{ color: textSecondary }}
      >
        a.n. {accountName}
      </p>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="mt-2 px-6 py-2.5 text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-200"
        style={{
          border: `1.5px solid ${accent}`,
          color: copied ? "#ffffff" : textPrimary,
          background: copied ? accent : "transparent",
          borderRadius: "8px",
        }}
      >
        {copied ? "Tersalin" : "Salin Nomor"}
      </button>
    </div>
  )
}

export default DigitalGift
