"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Separator } from "../ui/separator"
import useResponsive from "@/hooks/useResponsive"
import { Card } from "@/components/Card"

gsap.registerPlugin(ScrollTrigger)

export interface RomanticQuoteRef {
  getTimeline: () => gsap.core.Timeline
}

export const RomanticQuote = forwardRef<RomanticQuoteRef>((_, ref) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { isMobile } = useResponsive()

  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)

  
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  
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
      className="rq-section relative flex w-full items-center justify-center overflow-hidden bg-background min-h-[540px] md:min-h-[680px]"
    >
      
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[94vw] max-h-[480px] w-[94vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[620px] md:w-[620px] overflow-hidden">
        
        <div
          className="absolute inset-0 bg-wedding-dot opacity-60"
          style={{
            maskImage: "radial-gradient(circle, black 58%, transparent 76%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 58%, transparent 76%)",
          }}
        />
        
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--wedding-accent) 14%, transparent) 0%, color-mix(in srgb, var(--wedding-accent) 6%, transparent) 36%, transparent 70%)",
          }}
        />
      </div>

      <div className="rq-content relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-8 p-14 md:gap-10 ">
        <p className="rq-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase text-wedding-text-secondary">
          Kata Hati
        </p>

        
        <div
          ref={wrapperRef}
          className="relative flex w-[90vw] md:w-full items-center justify-center"
          style={{ perspective: "1000px" }}
        >
          <Card
            ref={cardRef}
            className="rq-card group w-full max-w-xl items-center justify-center px-8 py-10"
            style={
              {
                transformStyle: "preserve-3d",
                willChange: "transform",
                "--mouse-x": "50%",
                "--mouse-y": "50%",
              } as React.CSSProperties
            }
          >
            
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
          </Card>
        </div>
      </div>
    </section>
  )
})

RomanticQuote.displayName = "RomanticQuote"
export default RomanticQuote
