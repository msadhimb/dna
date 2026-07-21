"use client"

import React, { useRef } from "react"
import { useTheme } from "next-themes"
import { Heart } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const Ornament = ({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      transform: flip ? "rotate(180deg)" : "none",
      width: "100px",
      margin: "0 auto",
    }}
  >
    <div style={{ height: "1px", flex: 1, background: color }} />
    <div
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: color,
      }}
    />
    <div style={{ height: "1px", flex: 1, background: color }} />
  </div>
)

export const Footer = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const footerRef = useRef<HTMLElement>(null)

  const accent = isDark ? "#d4af37" : "#c9a227"
  const label = isDark ? "#7a6060" : "#9a865a"
  const body = isDark ? "#e0d8d0" : "#1e1a14"
  const border = isDark ? "rgba(212,175,55,0.15)" : "rgba(201,162,39,0.15)"

  useGSAP(
    () => {
      const elements = gsap.utils.toArray<HTMLElement>(".footer-anim")

      gsap.fromTo(
        elements,
        { opacity: 0, y: 16 },
        {
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }
      )
    },
    { scope: footerRef }
  )

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-background"
    >
      {/* Top border line */}
      <div
        className="absolute inset-x-0 top-0 mx-auto h-px w-full max-w-lg"
        style={{ background: border }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 py-16 text-center md:py-20">
        {/* Heart icon */}
        <div className="footer-anim">
          <Heart
            className="h-5 w-5"
            style={{ color: accent, opacity: 0.5 }}
            strokeWidth={1.5}
            fill={`${accent}30`}
          />
        </div>

        {/* Names */}
        <p
          className="footer-anim font-signature text-2xl md:text-3xl"
          style={{ color: body, letterSpacing: "0.05em" }}
        >
          Devi & Adhim
        </p>

        {/* Ornament */}
        <div className="footer-anim">
          <Ornament color={accent} />
        </div>

        {/* Thank you message */}
        <p
          className="footer-anim max-w-xs font-serif text-xs leading-relaxed italic"
          style={{ color: label }}
        >
          Terima kasih atas doa, ucapan, dan kehadiran Anda. Semoga Allah
          senantiasa melimpahkan keberkahan kepada kita semua.
        </p>

        {/* Divider */}
        <div
          className="footer-anim flex items-center gap-4"
          style={{ opacity: 0.4 }}
        >
          <div style={{ height: "1px", width: "32px", background: accent }} />
          <div
            style={{
              width: "5px",
              height: "5px",
              transform: "rotate(45deg)",
              border: `1px solid ${accent}`,
            }}
          />
          <div style={{ height: "1px", width: "32px", background: accent }} />
        </div>

        {/* Copyright */}
        <div className="footer-anim flex flex-col gap-1.5">
          <p
            className="font-sans text-[10px] tracking-[0.3em] uppercase"
            style={{ color: label, opacity: 0.7 }}
          >
            © 2026 · Devi & Adhim
          </p>
          <p
            className="font-sans text-[9px] tracking-[0.2em]"
            style={{ color: label, opacity: 0.4 }}
          >
            Made with{" "}
            <Heart
              className="inline h-2.5 w-2.5"
              style={{ color: accent }}
              fill={accent}
            />{" "}
            for our special day
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
