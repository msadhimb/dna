"use client"

import React, { useRef, useState } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/Button"
import { useGSAP } from "@gsap/react"
import {
  WaxSeal,
  OrnamentalDivider,
  EnvelopeIllustration,
} from "@/components/Icon"
import { CopyCheck, CopyIcon } from "lucide-react"
import BankAccountCard from "./components/BankAccountCard"

gsap.registerPlugin(ScrollTrigger)

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)

  // Keep Digital Gift in the same visual language as RomanticQuote.
  const accent = isDark ? "#FF2D55" : "#16A34A"
  const dot = isDark ? "rgba(255,45,85,0.06)" : "rgba(22,163,74,0.06)"
  const textPrimary = isDark ? "#FFFFFF" : "#111111"
  const textSecondary = isDark ? "#888888" : "#555555"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const borderAccent = isDark ? "rgba(255,45,85,0.25)" : "rgba(22,163,74,0.25)"
  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,85,0.06), transparent)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(22,163,74,0.06), transparent)"

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
        style={{ background: bgGradient }}
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
            svg={
              "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bni.svg"
            }
            accountNumber="1819801119"
            accountName="Salman Adhim"
            accent={accent}
            borderAccent={borderAccent}
            isDark={isDark}
          />
          <BankAccountCard
            svg={
              "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
            }
            accountNumber="7296154554"
            accountName="Devi Yuliana"
            accent={accent}
            borderAccent={borderAccent}
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
