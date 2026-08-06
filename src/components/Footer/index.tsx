"use client"

import React, { useRef } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export const Footer = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const footerRef = useRef<HTMLElement>(null)

  const accent = isDark ? "#A0280A" : "#16A34A"
  const text = isDark ? "#e0d8d0" : "#1e1a14"
  const muted = isDark ? "#555555" : "#a09080"
  const line = isDark ? "rgba(160,40,10,0.25)" : "rgba(22,163,74,0.25)"

  useGSAP(
    () => {
      gsap.fromTo(
        ".ft-el",
        { opacity: 0, y: 16 },
        {
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        }
      )
    },
    { scope: footerRef }
  )

  return (
    <footer
      ref={footerRef}
      className="relative flex w-full flex-col items-center gap-6 py-5 text-center"
    >
      {/* Thin top line */}
      <div className="ft-el h-px w-16" style={{ background: line }} />

      {/* Names */}
      <p
        className="ft-el font-signature font-bold"
        style={{
          fontSize: "clamp(2.4rem, 8vw, 4rem)",
          color: text,
          lineHeight: 1,
          letterSpacing: "0.04em",
        }}
      >
        Devi &amp; Adhim
      </p>

      {/* Three dots */}
      <div className="ft-el flex items-center gap-3">
        <div className="h-px w-6" style={{ background: line }} />
        <div className="flex gap-1.5">
          <div
            className="h-1 w-1 rotate-45"
            style={{ background: accent, opacity: 0.5 }}
          />
          <div className="h-1 w-1 rotate-45" style={{ background: accent }} />
          <div
            className="h-1 w-1 rotate-45"
            style={{ background: accent, opacity: 0.5 }}
          />
        </div>
        <div className="h-px w-6" style={{ background: line }} />
      </div>

      {/* Thank you */}
      <p
        className="ft-el max-w-xs font-sans text-sm font-light italic leading-relaxed"
        style={{ color: muted, lineHeight: 1.8 }}
      >
        Terima kasih atas doa, ucapan, dan kehadiran Anda.
      </p>

      {/* Date */}
      <p
        className="ft-el font-sans text-[11px] tracking-[0.3em] uppercase"
        style={{ color: muted, opacity: 0.6 }}
      >
        12 Desember 2026
      </p>

      {/* Bottom thin line */}
      <div className="ft-el mt-4 h-px w-16" style={{ background: line }} />

      {/* Copyright */}
      <p
        className="ft-el font-sans text-[9px] tracking-[0.25em] uppercase"
        style={{ color: muted, opacity: 0.35 }}
      >
        &copy; 2026 Devi &amp; Adhim
      </p>
    </footer>
  )
}

export default Footer
