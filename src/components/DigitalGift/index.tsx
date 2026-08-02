"use client"

import React, { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { Copy, Gift, CheckCircle2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════
   ORNAMENTAL ELEMENTS
═══════════════════════════════════════════════ */

const Ornament = ({ color, flip = false }: { color: string; flip?: boolean }) => (
  <svg viewBox="0 0 120 16" style={{ width: "100px", height: "14px", color, transform: flip ? "rotate(180deg)" : undefined }} fill="none">
    <path d="M0 8 H44 M76 8 H120" stroke="currentColor" strokeWidth="0.8" />
    <circle cx="60" cy="8" r="3" fill="currentColor" />
    <path d="M48 8 C52 3,58 3,60 8 C62 3,68 3,72 8" stroke="currentColor" strokeWidth="0.8" fill="none" />
    <path d="M48 8 C52 13,58 13,60 8 C62 13,68 13,72 8" stroke="currentColor" strokeWidth="0.8" fill="none" />
  </svg>
)

const WideOrnament = ({ color, flip = false }: { color: string; flip?: boolean }) => (
  <svg viewBox="0 0 200 12" style={{ width: "100%", maxWidth: "360px", height: "10px", color, transform: flip ? "rotate(180deg)" : undefined }} fill="none">
    <path d="M0 6 H70 M130 6 H200" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
    <path d="M75 6 L80 2 L85 6 L90 2 L95 6 L100 2 L105 6 L110 2 L115 6 L120 2 L125 6" stroke="currentColor" strokeWidth="0.6" fill="none" />
    <circle cx="100" cy="6" r="2" fill="currentColor" opacity="0.8" />
  </svg>
)

const CornerFlourish = ({ position, color }: { position: "tl" | "tr" | "bl" | "br"; color: string }) => {
  const rot = { tl: "0deg", tr: "90deg", bl: "-90deg", br: "180deg" }
  const pos = { tl: { top: 16, left: 16 }, tr: { top: 16, right: 16 }, bl: { bottom: 16, left: 16 }, br: { bottom: 16, right: 16 } }
  return (
    <svg viewBox="0 0 20 20" style={{ width: 20, height: 20, color, position: "absolute", transform: `rotate(${rot[position]})`, opacity: 0.5, ...pos[position] }} fill="none">
      <path d="M2 18 L2 2 L18 2" stroke="currentColor" strokeWidth="1" />
      <path d="M2 8 C2 4,6 2,8 2" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

const Rule = ({ color }: { color: string }) => (
  <div className="flex w-full items-center gap-4">
    <div style={{ height: "1px", flex: 1, background: color, opacity: 0.35 }} />
    <div style={{ width: "5px", height: "5px", transform: "rotate(45deg)", border: `1.5px solid ${color}`, opacity: 0.6 }} />
    <div style={{ height: "1px", flex: 1, background: color, opacity: 0.35 }} />
  </div>
)

/* ═══════════════════════════════════════════════
   BANK ACCOUNT CARD
═══════════════════════════════════════════════ */

const BankAccountCard = ({
  bank, accountNumber, accountName,
  accent, body, label, border, bg,
}: {
  bank: string; accountNumber: string; accountName: string
  accent: string; body: string; label: string; border: string; bg: string
}) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="dg-bank group relative flex flex-col items-center gap-5 px-8 py-10 text-center transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: bg, border: `1.5px solid ${border}` }}
    >
      <CornerFlourish position="tl" color={accent} />
      <CornerFlourish position="tr" color={accent} />
      <CornerFlourish position="bl" color={accent} />
      <CornerFlourish position="br" color={accent} />

      <Ornament color={accent} />

      <p className="font-serif text-[11px] font-semibold tracking-[0.5em] uppercase" style={{ color: label }}>
        {bank}
      </p>

      <p className="font-signature font-bold" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: body, letterSpacing: "0.06em" }}>
        {accountNumber}
      </p>

      <div style={{ height: "1.5px", width: "60px", background: accent, opacity: 0.4 }} />

      <p className="font-sans text-[12px] font-semibold tracking-[0.2em] uppercase" style={{ color: label }}>
        a.n. {accountName}
      </p>

      <button
        onClick={handleCopy}
        className="mt-2 flex items-center gap-2 px-8 py-3 text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-200"
        style={{
          border: `2px solid ${accent}`,
          color: copied ? "#ffffff" : body,
          background: copied ? accent : "transparent",
          fontWeight: 700,
        }}
      >
        {copied ? (
          <><CheckCircle2 size={14} /><span>Tersalin</span></>
        ) : (
          <><Copy size={14} /><span>Salin Nomor</span></>
        )}
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════ */

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)

  // ── Tokens — HIGH CONTRAST ──
  const accent = isDark ? "#A0280A" : "#8B6914"
  const label = isDark ? "#9A8070" : "#7A6840"
  const body = isDark ? "#F0E8E0" : "#1C1410"
  const dot = isDark ? "#83200420" : "#a0805030"
  const border = isDark ? "rgba(160,40,10,0.45)" : "rgba(139,105,20,0.45)"
  const cardBg = isDark ? "rgba(255,252,245,0.05)" : "rgba(255,255,255,0.85)"
  const glowBg = isDark
    ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(160,40,10,0.09), transparent)"
    : "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,105,20,0.09), transparent)"

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", toggleActions: "play none none reverse" },
      })
      tl.fromTo(".dg-header", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" })
        .fromTo(".dg-orn-top", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", transformOrigin: "center" }, "-=0.5")
        .fromTo(".dg-invitation", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.4")
        .fromTo(".dg-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: "center" }, "-=0.4")
        .fromTo(".dg-bank", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }, "-=0.5")
        .fromTo(".dg-closing", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
        .fromTo(".dg-orn-bottom", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.3")
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-background will-change-transform">
      {/* Dot texture */}
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${dot} 1.5px, transparent 0)`, backgroundSize: "28px 28px" }} />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" style={{ background: glowBg }} />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-14 px-6 py-24 md:px-10 md:py-36">

        {/* ── Header ── */}
        <div className="dg-header flex flex-col items-center gap-5 text-center">
          <p className="font-serif text-[11px] font-semibold tracking-[0.6em] uppercase" style={{ color: label }}>
            Amplop Digital
          </p>
          <h2 className="font-signature font-bold" style={{ fontSize: "clamp(3rem, 9vw, 5.5rem)", color: body, lineHeight: 1 }}>
            Wedding Gift
          </h2>
          <div className="dg-orn-top">
            <WideOrnament color={accent} />
          </div>
        </div>

        {/* ── Invitation letter card ── */}
        <div
          className="dg-invitation relative w-full max-w-2xl px-10 py-14 text-center"
          style={{ border: `1.5px solid ${border}`, background: cardBg, backdropFilter: "blur(4px)" }}
        >
          <CornerFlourish position="tl" color={accent} />
          <CornerFlourish position="tr" color={accent} />
          <CornerFlourish position="bl" color={accent} />
          <CornerFlourish position="br" color={accent} />

          <div className="mb-4 flex justify-center">
            <Gift size={36} style={{ color: accent, opacity: 0.75 }} strokeWidth={1} />
          </div>

          <div className="flex justify-center">
            <Ornament color={accent} />
          </div>

          <p className="mt-6 font-signature font-bold" style={{ fontSize: "clamp(1.5rem, 4vw, 2.2rem)", color: body, lineHeight: 1.4 }}>
            Devi &amp; Adhim
          </p>

          <div style={{ height: "1.5px", width: "48px", background: accent, opacity: 0.35, margin: "16px auto" }} />

          <p className="mx-auto max-w-sm font-sans text-sm font-semibold leading-relaxed" style={{ color: label, lineHeight: 2 }}>
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah hati menerimanya.
          </p>

          <div className="mt-6 flex justify-center">
            <Ornament color={accent} flip />
          </div>
        </div>

        {/* ── Rule ── */}
        <div className="dg-rule w-full max-w-sm">
          <Rule color={accent} />
        </div>

        {/* ── Bank cards ── */}
        <div className="flex w-full max-w-2xl flex-col gap-6 md:flex-row md:gap-8">
          <div className="dg-bank flex-1">
            <BankAccountCard
              bank="Bank Central Asia" accountNumber="1234567890" accountName="Salman Adhim"
              accent={accent} body={body} label={label} border={border} bg={cardBg}
            />
          </div>
          <div className="dg-bank flex-1">
            <BankAccountCard
              bank="Bank Mandiri" accountNumber="0987654321" accountName="Pasangan Salman"
              accent={accent} body={body} label={label} border={border} bg={cardBg}
            />
          </div>
        </div>

        {/* ── Closing ── */}
        <div className="dg-closing flex flex-col items-center gap-5 text-center">
          <Rule color={accent} />
          <p className="max-w-lg font-serif text-sm font-semibold leading-relaxed italic" style={{ color: label, lineHeight: 2 }}>
            &ldquo;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak, Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.&rdquo;
          </p>
          <p className="font-signature font-bold" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: body, letterSpacing: "0.05em" }}>
            Devi &amp; Adhim
          </p>
          <Rule color={accent} />
        </div>

        {/* ── Bottom ── */}
        <div className="dg-orn-bottom">
          <WideOrnament color={accent} flip />
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
