"use client"

import React, { useRef } from "react"
import { useTheme } from "next-themes"
import { Copy, Gift, CheckCircle2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

interface BankAccountProps {
  bank: string
  accountNumber: string
  accountName: string
  accent: string
  body: string
  label: string
  borderColor: string
}

const BankAccount = ({
  bank,
  accountNumber,
  accountName,
  accent,
  body,
  label,
  borderColor,
}: BankAccountProps) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const [copied, setCopied] = React.useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="gift-anim group relative flex flex-col items-center justify-center gap-5 overflow-hidden px-8 py-10 text-center transition-all duration-500"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <p
          className="font-serif text-[10px] tracking-[0.5em] uppercase"
          style={{ color: label }}
        >
          {bank}
        </p>

        <p
          className="font-mono text-xl tracking-[0.15em] md:text-2xl"
          style={{ color: body, letterSpacing: "0.15em" }}
        >
          {accountNumber}
        </p>

        <div
          style={{
            height: "1px",
            width: "60px",
            background: accent,
            opacity: 0.2,
            margin: "0 auto",
          }}
        />

        <p
          className="font-sans text-xs tracking-[0.2em] uppercase"
          style={{ color: label }}
        >
          a.n. {accountName}
        </p>

        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-2 px-6 py-2.5 text-[10px] font-medium tracking-[0.3em] uppercase transition-all duration-300"
          style={{
            border: `1px solid ${accent}50`,
            color: copied ? accent : body,
            background: copied ? `${accent}15` : "transparent",
          }}
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Tersalin</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Rekening</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const containerRef = useRef<HTMLElement>(null)

  const accent = isDark ? "#d4af37" : "#c9a227"
  const label = isDark ? "#7a6060" : "#9a865a"
  const body = isDark ? "#e0d8d0" : "#1e1a14"
  const dot = isDark ? "#83200415" : "#a0805022"
  const border = isDark ? "rgba(212,175,55,0.25)" : "rgba(201,162,39,0.25)"

  useGSAP(
    () => {
      const elements = gsap.utils.toArray<HTMLElement>(".gift-anim")

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        elements,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.13,
          ease: "power3.out",
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(131,32,4,0.06), transparent)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.06), transparent)",
        }}
      />
      {/* Dot pattern background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-10 p-6 py-24 text-center md:gap-12 md:py-32">
        {/* Label */}
        <p
          className="gift-anim font-serif text-[10px] tracking-[0.5em] uppercase"
          style={{ color: label }}
        >
          Amplop Digital
        </p>

        {/* Framed gift icon + title */}
        <div
          className="gift-anim relative w-full max-w-2xl px-10 py-12"
          style={{ border: `1px solid ${border}` }}
        >
          <div className="flex flex-col items-center gap-5">
            <Gift
              className="h-10 w-10"
              style={{ color: accent, opacity: 0.7 }}
              strokeWidth={1}
            />
            <h2
              className="font-signature text-4xl md:text-5xl"
              style={{ color: body }}
            >
              Wedding Gift
            </h2>
            <div
              style={{
                height: "1px",
                width: "60px",
                background: accent,
                opacity: 0.2,
              }}
            />
            <p
              className="max-w-sm font-sans text-sm leading-relaxed md:text-base"
              style={{ color: label, lineHeight: 1.8 }}
            >
              Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
              Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah
              hati menerimanya.
            </p>
          </div>
        </div>

        {/* Bank cards */}
        <div className="flex w-full max-w-2xl flex-col gap-6 md:flex-row md:gap-8">
          <div className="flex-1">
            <BankAccount
              bank="Bank Central Asia"
              accountNumber="1234567890"
              accountName="Salman Adhim"
              accent={accent}
              body={body}
              label={label}
              borderColor={border}
            />
          </div>
          <div className="flex-1">
            <BankAccount
              bank="Bank Mandiri"
              accountNumber="0987654321"
              accountName="Pasangan Salman"
              accent={accent}
              body={body}
              label={label}
              borderColor={border}
            />
          </div>
        </div>

        {/* Closing message */}
        <div className="gift-anim flex flex-col items-center gap-5">
          <p
            className="max-w-md font-serif text-sm leading-relaxed italic"
            style={{ color: label }}
          >
            &ldquo;Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa
            restu.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
