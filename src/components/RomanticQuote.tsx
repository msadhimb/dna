"use client"

import React, { useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const Ornament = ({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) => {
  return (
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
}

const WideOrnament = ({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        width: "100%",
        maxWidth: "300px",
        transform: flip ? "rotate(180deg)" : "none",
      }}
    >
      <div
        style={{ height: "1px", flex: 1, background: color, opacity: 0.6 }}
      />
      <div
        style={{
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: color,
          opacity: 0.8,
        }}
      />
      <div
        style={{ height: "1px", flex: 1, background: color, opacity: 0.6 }}
      />
    </div>
  )
}

const CornerAccent = ({
  position,
  color,
}: {
  position: "tl" | "tr" | "bl" | "br"
  color: string
}) => {
  const styles: React.CSSProperties = {
    position: "absolute",
    width: "16px",
    height: "16px",
    borderColor: color,
    opacity: 0.4,
  }

  if (position === "tl") {
    styles.top = "14px"
    styles.left = "14px"
    styles.borderTop = "1px solid"
    styles.borderLeft = "1px solid"
  } else if (position === "tr") {
    styles.top = "14px"
    styles.right = "14px"
    styles.borderTop = "1px solid"
    styles.borderRight = "1px solid"
  } else if (position === "bl") {
    styles.bottom = "14px"
    styles.left = "14px"
    styles.borderBottom = "1px solid"
    styles.borderLeft = "1px solid"
  } else if (position === "br") {
    styles.bottom = "14px"
    styles.right = "14px"
    styles.borderBottom = "1px solid"
    styles.borderRight = "1px solid"
  }

  return <div style={styles} />
}

const SplitLine = ({ text }: { text: string }) => {
  return (
    <span style={{ display: "block" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="qchar"
          style={{
            display: "inline-block",
            whiteSpace: ch === " " ? "pre" : "normal",
            willChange: "transform, opacity",
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

const RomanticQuote = () => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const accent = isDark ? "#832004" : "#c9a227"
  const label = isDark ? "#7a6060" : "#9a865a"
  const body = isDark ? "#e0d8d0" : "#1e1a14"
  const dot = isDark ? "#83200415" : "#a0805022"
  const borderColor = isDark ? "rgba(131,32,4,0.25)" : "rgba(201,162,39,0.25)"
  const divider = isDark ? "rgba(131,32,4,0.18)" : "rgba(201,162,39,0.18)"

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const orn1Ref = useRef<HTMLDivElement>(null)
  const quoteBlockRef = useRef<HTMLDivElement>(null)
  const quoteTextRef = useRef<HTMLParagraphElement>(null)
  const transRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const namesRef = useRef<HTMLParagraphElement>(null)
  const orn2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fadeEls = [
        labelRef.current,
        orn1Ref.current,
        quoteBlockRef.current,
        dividerRef.current,
        namesRef.current,
        orn2Ref.current,
      ].filter(Boolean)

      const quoteChars = quoteTextRef.current
        ? Array.from(quoteTextRef.current.querySelectorAll(".qchar"))
        : []
      const transChars = transRef.current
        ? Array.from(transRef.current.querySelectorAll(".qchar"))
        : []
      const allChars = [...quoteChars, ...transChars]

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        fadeEls,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.13, ease: "power3.out" }
      )

      if (allChars.length) {
        tl.fromTo(
          allChars,
          {
            opacity: 0,
            x: (i: number) => Math.cos(i * 2.4) * gsap.utils.random(20, 70),
            y: (i: number) => Math.sin(i * 2.4) * gsap.utils.random(20, 70),
            rotate: () => gsap.utils.random(-40, 40),
            scale: 0.6,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 1.3,
            stagger: { each: 0.012, from: "center" },
            ease: "elastic.out(1, 0.65)",
          },
          "-=0.5"
        )
      }

      return () => {
        tl.kill()
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(131,32,4,0.06), transparent)"
            : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,162,39,0.06), transparent)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 p-6 text-center md:gap-10 md:py-32">
        <p
          ref={labelRef}
          style={{
            fontFamily: "serif",
            fontSize: "10px",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: label,
          }}
        >
          Kata Hati
        </p>

        <div ref={orn1Ref} className="flex w-full justify-center">
          <WideOrnament color={accent} />
        </div>

        <div
          ref={quoteBlockRef}
          className="relative w-full max-w-lg px-10 py-12 text-center"
          style={{ border: `1px solid ${borderColor}` }}
        >
          <CornerAccent position="tl" color={accent} />
          <CornerAccent position="tr" color={accent} />
          <CornerAccent position="bl" color={accent} />
          <CornerAccent position="br" color={accent} />

          <Ornament color={accent} />

          <p
            ref={quoteTextRef}
            className="font-signature"
            style={{
              fontSize: "clamp(1.3rem, 3.5vw, 2rem)",
              color: body,
              lineHeight: 1.6,
              margin: "20px 0",
            }}
          >
            <SplitLine text="&ldquo;Da moram živjeti deset tisuća života," />
            <SplitLine text="uvijek bih izabrala tebe.&rdquo;" />
          </p>

          <div
            style={{
              height: "1px",
              background: divider,
              margin: "8px auto",
              width: "60px",
            }}
          />

          <Ornament color={accent} flip />
        </div>

        <p
          ref={transRef}
          style={{
            fontFamily: "var(--font-serif, serif)",
            fontSize: "clamp(0.85rem, 2vw, 1rem)",
            color: label,
            fontStyle: "italic",
            lineHeight: 2,
            maxWidth: "400px",
            letterSpacing: "0.03em",
          }}
        >
          <SplitLine text="&ldquo;Jika aku harus menjalani sepuluh ribu kehidupan," />
          <SplitLine text="aku akan selalu memilihmu.&rdquo;" />
        </p>

        <div ref={orn2Ref} className="flex w-full justify-center">
          <WideOrnament color={accent} flip />
        </div>
      </div>
    </section>
  )
}

export default RomanticQuote
