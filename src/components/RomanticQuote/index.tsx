"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { gsap } from "@/lib/gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useResponsive from "@/hooks/useResponsive"
import { Card } from "@/components/Card"
import { OrnamentalDivider } from "@/components/Icons/OrnamentalDivider"

export interface RomanticQuoteRef {
  getTimeline: () => gsap.core.Timeline
}

export const RomanticQuote = forwardRef<RomanticQuoteRef>((_, ref) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const { isMobile } = useResponsive()

  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const targetRot = useRef({ x: 0, y: 0 })

  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  /* ---------- Entrance elegan: ScrollTrigger mandiri ---------- */
  useEffect(() => {
    const section = sectionRef.current
    const card = cardRef.current
    if (!section || !card) return
    if (prefersReducedMotion()) {
      gsap.set(section.querySelectorAll("[data-rq]"), {
        clearProps: "all",
        opacity: 1,
      })
      return
    }

    const ctx = gsap.context(() => {
      // --- state awal (halus, tanpa pop) ---
      gsap.set(".rq-halo", {
        opacity: 0,
        scale: 0.82,
        transformOrigin: "50% 50%",
      })
      gsap.set(".rq-dots", { opacity: 0, scale: 0.94 })
      gsap.set(".rq-eyebrow", { opacity: 0, y: 14 })
      gsap.set(".rq-eyebrow .rq-rule", { scaleX: 0 })
      gsap.set(".rq-card", {
        opacity: 0,
        y: 72,
        scale: 0.962,
        rotationX: 7,
        transformPerspective: 1200,
        transformOrigin: "50% 60%",
        filter: "blur(14px)",
      })
      gsap.set(".rq-topline", { scaleX: 0, transformOrigin: "50% 50%" })
      gsap.set(".rq-frame", { opacity: 0, scale: 0.97 })
      gsap.set(".rq-mark", { opacity: 0, y: 18, scale: 0.72, rotation: -8 })
      gsap.set(".rq-line-inner", { yPercent: 115 })
      gsap.set(".rq-line-mask", { opacity: 1 })
      gsap.set(".rq-divider", { opacity: 0, scaleX: 0.4, y: 8 })
      gsap.set(".rq-trans", { opacity: 0, y: 22, filter: "blur(6px)" })
      gsap.set(".rq-shine-sweep", { xPercent: -160, opacity: 0 })
      gsap.set(".rq-sparkle", { opacity: 0, scale: 0 })

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          end: "bottom 45%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(
        ".rq-halo",
        { opacity: 1, scale: 1, duration: 2, ease: "expo.out" },
        0
      )
        .to(".rq-dots", { opacity: 0.6, scale: 1, duration: 1.8 }, 0.1)
        .to(".rq-eyebrow", { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .to(".rq-eyebrow .rq-rule", { scaleX: 1, duration: 1.1 }, 0.2)
        // kartu: naik pelan + tajam dari blur — inti kesan elegan
        .to(
          ".rq-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.5,
          },
          0.25
        )
        .to(".rq-topline", { scaleX: 1, duration: 1.2 }, 0.7)
        .to(".rq-frame", { opacity: 0.4, scale: 1, duration: 1.1 }, 0.8)
        .to(
          ".rq-mark",
          { opacity: 0.3, y: 0, scale: 1, rotation: 0, duration: 1.2 },
          0.75
        )
        // teks utama: reveal per baris dari balik mask
        .to(
          ".rq-line-inner",
          { yPercent: 0, duration: 1.15, stagger: 0.16 },
          0.85
        )
        .to(
          ".rq-divider",
          { opacity: 0.7, scaleX: 1, y: 0, duration: 0.9 },
          1.25
        )
        .to(
          ".rq-trans",
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          1.35
        )
        // kilau sapuan sekali, sangat subtil
        .to(".rq-shine-sweep", { opacity: 1, duration: 0.25 }, 1.4)
        .fromTo(
          ".rq-shine-sweep",
          { xPercent: -160 },
          { xPercent: 160, duration: 1.4, ease: "expo.inOut" },
          1.4
        )
        .to(".rq-shine-sweep", { opacity: 0, duration: 0.4 }, 2.5)
        .to(
          ".rq-sparkle",
          { opacity: 1, scale: 1, duration: 0.8, stagger: 0.14 },
          1.5
        )

      // --- ambien: napas lembut setelah entrance ---
      const ambient = gsap.timeline({ delay: 2.2, repeat: -1, yoyo: true })
      ambient
        .to(floatRef.current, { y: -9, duration: 3.4, ease: "sine.inOut" }, 0)
        .to(
          ".rq-halo",
          { scale: 1.045, opacity: 0.9, duration: 3.4, ease: "sine.inOut" },
          0
        )
        .to(".rq-mark", { y: -5, duration: 3.4, ease: "sine.inOut" }, 0)
        .to(
          ".rq-sparkle",
          { y: -10, duration: 3.4, ease: "sine.inOut", stagger: 0.2 },
          0
        )

      // pause ambien saat di luar viewport (hemat CPU)
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: () => ambient.pause(),
        onEnterBack: () => ambient.play(),
        onLeaveBack: () => ambient.pause(),
        onEnter: () => ambient.play(),
      })

      // --- parallax subtil saat scroll ---
      gsap.to(".rq-halo", {
        y: 70,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      })
      gsap.to(".rq-content", {
        y: -26,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  /* ---------- Tilt desktop: lembut via quickTo (tidak menimpa entrance) ---------- */
  useEffect(() => {
    const card = cardRef.current
    const zone = floatRef.current
    if (!card || !zone || isMobile) return
    if (prefersReducedMotion()) return

    gsap.set(card, { transformPerspective: 1200 })
    const qRotX = gsap.quickTo(card, "rotationX", {
      duration: 0.9,
      ease: "expo.out",
    })
    const qRotY = gsap.quickTo(card, "rotationY", {
      duration: 0.9,
      ease: "expo.out",
    })
    const qShine = gsap.quickTo(card.querySelector(".rq-shine"), "opacity", {
      duration: 0.4,
      ease: "power2.out",
    } as any)

    let raf = 0
    const render = () => {
      qRotY(targetRot.current.y)
      qRotX(targetRot.current.x)
      raf = requestAnimationFrame(render)
    }

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      // maks ±6° — jauh lebih sopan dari 20° sebelumnya
      targetRot.current.y = (px - 0.5) * 12
      targetRot.current.x = -(py - 0.5) * 10
      card.style.setProperty("--mouse-x", `${px * 100}%`)
      card.style.setProperty("--mouse-y", `${py * 100}%`)
      qShine(1)
      gsap.to(card, {
        scale: 1.012,
        duration: 0.7,
        ease: "expo.out",
        overwrite: "auto",
      })
    }
    const onLeave = () => {
      targetRot.current = { x: 0, y: 0 }
      qShine(0)
      gsap.to(card, {
        scale: 1,
        duration: 1,
        ease: "expo.out",
        overwrite: "auto",
      })
    }

    zone.addEventListener("mousemove", onMove)
    zone.addEventListener("mouseleave", onLeave)
    raf = requestAnimationFrame(render)
    return () => {
      zone.removeEventListener("mousemove", onMove)
      zone.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(raf)
    }
  }, [isMobile])

  /* ---------- Mobile: ayunan napas, bukan goyangan kaku ---------- */
  useEffect(() => {
    const el = floatRef.current
    if (!el || !isMobile) return
    if (prefersReducedMotion()) return

    gsap.set(el, { transformPerspective: 900 })
    const sway = gsap.to(el, {
      rotationY: 1.6,
      rotationX: -1,
      y: -6,
      duration: 4.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    })
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? sway.play() : sway.pause()),
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      sway.kill()
    }
  }, [isMobile])

  useEffect(() => {
    targetRot.current = { x: 0, y: 0 }
  }, [isDark])

  useImperativeHandle(ref, () => ({
    getTimeline: () => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })
      tl.fromTo(
        ".rq-halo",
        { opacity: 0, scale: 0.82 },
        { opacity: 1, scale: 1, duration: 1.6 },
        0
      )
        .fromTo(
          ".rq-eyebrow",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9 },
          0.1
        )
        .fromTo(
          ".rq-card",
          {
            opacity: 0,
            y: 72,
            scale: 0.962,
            rotationX: 7,
            filter: "blur(14px)",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.5,
          },
          0.2
        )
        .fromTo(
          ".rq-line-inner",
          { yPercent: 115 },
          { yPercent: 0, duration: 1.15, stagger: 0.16 },
          0.7
        )
        .fromTo(
          ".rq-divider",
          { opacity: 0, scaleX: 0.4 },
          { opacity: 0.7, scaleX: 1, duration: 0.9 },
          1.1
        )
        .fromTo(
          ".rq-trans",
          { opacity: 0, y: 22, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          1.2
        )
      return tl
    },
  }))

  return (
    <section
      ref={sectionRef}
      className="rq-section relative flex w-full items-center justify-center overflow-hidden bg-background min-h-[540px] md:min-h-[680px]"
    >
      {/* halo + pola titik: parallax + napas */}
      <div
        ref={haloRef}
        className="rq-halo pointer-events-none absolute left-1/2 top-1/2 h-[94vw] max-h-[480px] w-[94vw] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full md:h-[620px] md:w-[620px]"
      >
        <div
          className="rq-dots absolute inset-0 bg-wedding-dot opacity-60"
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
              "radial-gradient(circle, color-mix(in srgb, var(--wedding-accent) 16%, transparent) 0%, color-mix(in srgb, var(--wedding-accent) 7%, transparent) 38%, transparent 70%)",
          }}
        />
      </div>

      {/* sparkle melayang */}
      <span
        data-rq
        className="rq-sparkle pointer-events-none absolute left-[18%] top-[24%] h-1.5 w-1.5 rounded-full bg-wedding-accent/60 blur-[0.5px]"
        aria-hidden="true"
      />
      <span
        data-rq
        className="rq-sparkle pointer-events-none absolute right-[16%] top-[38%] h-1 w-1 rounded-full bg-wedding-accent/50"
        aria-hidden="true"
      />
      <span
        data-rq
        className="rq-sparkle pointer-events-none absolute bottom-[22%] left-[30%] h-1 w-1 rounded-full bg-wedding-accent/40"
        aria-hidden="true"
      />

      <div className="rq-content relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-7 p-5 md:gap-8">
        <div
          data-rq
          className="rq-eyebrow flex items-center gap-4"
          aria-hidden="true"
        >
          <span className="rq-rule block h-px w-10 bg-wedding-accent/50" />
          <OrnamentalDivider size="small" className="opacity-80" />
          <span className="rq-rule block h-px w-10 bg-wedding-accent/50" />
        </div>

        <div
          ref={floatRef}
          className="relative flex w-[90vw] items-center justify-center md:w-full"
          style={{ perspective: "1200px" }}
        >
          <Card
            ref={cardRef}
            withCorners={false}
            className="rq-card group relative w-full max-w-xl items-center justify-center overflow-hidden px-7 py-12 md:px-14 md:py-14"
            style={
              {
                transformStyle: "preserve-3d",
                "--mouse-x": "50%",
                "--mouse-y": "50%",
              } as React.CSSProperties
            }
          >
            <div
              data-rq
              className="rq-topline pointer-events-none absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-wedding-accent to-transparent"
              aria-hidden="true"
            />
            <div
              data-rq
              aria-hidden="true"
              className="rq-frame pointer-events-none absolute inset-3 rounded-[14px] border border-wedding-border-accent opacity-40"
            />
            <div
              className="rq-shine pointer-events-none absolute inset-0 rounded-[20px] opacity-0"
              style={{
                background: `radial-gradient(circle 220px at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.13), transparent 62%)`,
              }}
            />
            {/* sapuan kilau sekali saat entrance */}
            <div
              data-rq
              aria-hidden="true"
              className="rq-shine-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <div className="relative flex flex-col items-center gap-6">
              <span
                data-rq
                aria-hidden="true"
                className="rq-mark font-serif text-6xl leading-none text-wedding-accent opacity-30 select-none md:text-7xl"
              >
                &ldquo;
              </span>

              <blockquote className="flex flex-col items-center gap-1 text-center">
                <span className="rq-line-mask block overflow-hidden pb-1">
                  <span
                    data-rq
                    className="rq-line-inner block font-signature text-4xl leading-[1.25] text-balance text-wedding-text-primary md:text-[2.9rem]"
                  >
                    Da moram živjeti deset tisuća života,
                  </span>
                </span>
                <span className="rq-line-mask block overflow-hidden pb-2">
                  <span
                    data-rq
                    className="rq-line-inner block font-signature text-4xl leading-[1.25] text-balance text-wedding-text-primary md:text-[2.9rem]"
                  >
                    uvijek bih izabrala tebe.
                  </span>
                </span>
              </blockquote>

              <div data-rq className="rq-divider">
                <OrnamentalDivider size="small" className="opacity-70" />
              </div>
              <p
                data-rq
                className="rq-trans font-serif text-[15px] leading-relaxed italic text-center text-balance text-wedding-text-secondary md:text-base"
              >
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
