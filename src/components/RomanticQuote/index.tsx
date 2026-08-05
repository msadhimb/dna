"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Separator } from "../ui/separator"

gsap.registerPlugin(ScrollTrigger)

export interface RomanticQuoteRef {
  getTimeline: () => gsap.core.Timeline
}

export const RomanticQuote = forwardRef<RomanticQuoteRef>((_, ref) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

  const accent = isDark ? "#FF2D55" : "#16A34A"
  const dot = isDark ? "rgba(255,45,85,0.06)" : "rgba(22,163,74,0.06)"
  const surface = isDark ? "#0A0A0A" : "#F8F8F8"
  const textPrimary = isDark ? "#FFFFFF" : "#111111"
  const textSecondary = isDark ? "#888888" : "#555555"
  const borderAccent = isDark ? "rgba(255,45,85,0.25)" : "rgba(22,163,74,0.25)"
  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,85,0.06), transparent)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(22,163,74,0.06), transparent)"

  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)

  // Smooth lerp
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  // Desktop: mouse parallax
  useEffect(() => {
    if (isMobile || !cardRef.current || !wrapperRef.current) return

    const card = cardRef.current

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const pctX = (e.clientX - rect.left) / rect.width
      const pctY = (e.clientY - rect.top) / rect.height

      targetX.current = (pctX - 0.5) * 20
      targetY.current = (pctY - 0.5) * 20

      card.style.setProperty("--mouse-x", `${pctX * 100}%`)
      card.style.setProperty("--mouse-y", `${pctY * 100}%`)
      gsap.to(card.querySelector(".rq-shine"), { opacity: 1, duration: 0.15 })
    }

    const onMouseLeave = () => {
      targetX.current = 0
      targetY.current = 0
      gsap.to(card.querySelector(".rq-shine"), { opacity: 0, duration: 0.5 })
    }

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.06)
      currentY.current = lerp(currentY.current, targetY.current, 0.06)

      card.style.transform = `
        perspective(1000px)
        rotateY(${currentX.current}deg)
        rotateX(${-currentY.current}deg)
        translateZ(0)
      `

      rafRef.current = requestAnimationFrame(animate)
    }

    wrapperRef.current.addEventListener("mousemove", onMouseMove)
    wrapperRef.current.addEventListener("mouseleave", onMouseLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      wrapperRef.current?.removeEventListener("mousemove", onMouseMove)
      wrapperRef.current?.removeEventListener("mouseleave", onMouseLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  // Mobile: auto smooth sway kiri-kanan (tidak pakai device orientation)
  useEffect(() => {
    if (!isMobile || !cardRef.current) return

    const card = cardRef.current
    let isVisible = false
    let tween: gsap.core.Tween | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting
        if (isVisible) {
          tween?.play()
        } else {
          tween?.pause()
        }
      },
      { threshold: 0 }
    )
    observer.observe(card)

    // set state awal supaya matrix transform-nya konsisten dgn gsap punya
    gsap.set(card, { transformPerspective: 800, rotationY: -10 })

    tween = gsap.to(card, {
      rotationY: 10,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })

    return () => {
      observer.disconnect()
      tween?.kill()
    }
  }, [isMobile])

  // Reset on theme change
  useEffect(() => {
    currentX.current = 0
    currentY.current = 0
    targetX.current = 0
    targetY.current = 0
  }, [isDark])

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline()

      tl.fromTo(
        ".rq-eyebrow",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      ).fromTo(
        ".rq-card",
        { opacity: 0, y: 60, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: "power3.out" },
        "-=0.3"
      )

      return tl
    },
  }))

  return (
    <section
      ref={sectionRef}
      className="rq-section relative w-full overflow-hidden"
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
        style={{ background: bgGradient }}
      />

      <div className="rq-content relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 p-14 md:gap-10 ">
        <p
          className="rq-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase"
          style={{ color: textSecondary }}
        >
          Kata Hati
        </p>

        {/* Perspective wrapper */}
        <div
          ref={wrapperRef}
          className="relative flex w-[90vw] md:w-full items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <div
            ref={cardRef}
            className="rq-card group relative flex w-full max-w-xl flex-col items-center justify-center px-8 py-10"
            style={
              {
                background: surface,
                border: `1px solid ${borderAccent}`,
                borderRadius: "20px",
                transformStyle: "preserve-3d",
                willChange: "transform",
                "--mouse-x": "50%",
                "--mouse-y": "50%",
                boxShadow: isDark
                  ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
                  : "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
              } as React.CSSProperties
            }
          >
            {/* Shine overlay — inside card, always matches card dimensions exactly */}
            <div
              className="rq-shine pointer-events-none absolute inset-0 rounded-[20px] opacity-0"
              style={{
                background: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.12), transparent 60%)`,
              }}
            />
            <div className="flex flex-col gap-5">
              <p className="font-signature  leading-relaxed font-bold text-2xl text-center">
                &ldquo;Da moram živjeti deset tisuća života,
                <br />
                uvijek bih izabrala tebe.&rdquo;
              </p>

              <Separator />
              <p className="font-sans text-sm leading-relaxed italic text-gray-500 text-center">
                &ldquo;Jika aku harus menjalani sepuluh ribu kehidupan,
                <br />
                aku akan selalu memilihmu.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})

RomanticQuote.displayName = "RomanticQuote"
export default RomanticQuote
