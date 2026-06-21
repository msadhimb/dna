"use client"

import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface JourneySequenceProps {
  theme: "light" | "dark"
}

const stories = [
  {
    num: "01",
    script: "Awal Cerita",
    title: "Pertemuan Pertama",
    body: "Dua benang kehidupan yang mulanya tak saling mengenal, melintasi ruang yang sunyi. Tak sengaja bertaut di satu titik waktu — melahirkan getar yang perlahan tumbuh menjadi kepastian.",
  },
  {
    num: "02",
    script: "Perjalanan",
    title: "Menjalin Kisah",
    body: "Dalam tawa, air mata, dan mimpi-mimpi kecil yang dirangkut bersama, waktu perlahan mengukir arti kesetiaan. Kami menyadari bahwa rumah bukanlah sebuah tempat — melainkan detak jantung satu sama lain.",
  },
  {
    num: "03",
    script: "Janji",
    title: "Komitmen Suci",
    body: "Hingga tiba saatnya, saat takdir tak lagi berbisik namun bersuara lantang menuntun kami menuju satu gerbang yang sama. Membulatkan tekad untuk mengarungi sisa waktu di bawah langit yang sama.",
  },
]

export function JourneySequence({ theme }: JourneySequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const imagesRef = useRef<HTMLImageElement[]>([])
  const activeThemeRef = useRef<string>(theme)
  const frameCount = theme === "dark" ? 242 : 215

  const getFramePath = (i: number, t: "light" | "dark") =>
    `/asset/pre-wed/image-sequence/${t}/frame_${String(i).padStart(6, "0")}.jpg`

  // ——— Cover-fit draw ———
  const draw = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
    if (!img.complete || img.naturalWidth === 0) return
    const { width: cw, height: ch } = ctx.canvas
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const x = (cw - img.naturalWidth * scale) / 2
    const y = (ch - img.naturalHeight * scale) / 2
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(
      img,
      x,
      y,
      img.naturalWidth * scale,
      img.naturalHeight * scale
    )
  }

  // ——— Preloader ———
  useEffect(() => {
    activeThemeRef.current = theme
    setIsLoaded(false)
    setLoadingProgress(0)

    let loaded = 0
    const imgs: HTMLImageElement[] = []

    const first = new Image()
    first.src = getFramePath(0, theme)
    first.onload = () => {
      if (canvasRef.current && activeThemeRef.current === theme) {
        const c = canvasRef.current
        c.width = window.innerWidth
        c.height = window.innerHeight
        draw(c.getContext("2d")!, first)
      }
    }

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.src = getFramePath(i, theme)
      img.onload = () => {
        if (activeThemeRef.current !== theme) return
        loaded++
        setLoadingProgress(Math.round((loaded / frameCount) * 100))
        if (loaded === frameCount) setIsLoaded(true)
      }
      imgs.push(img)
    }
    imagesRef.current = imgs
  }, [theme, frameCount])

  // ——— Resize ———
  useEffect(() => {
    const onResize = () => {
      if (!canvasRef.current || imagesRef.current.length === 0) return
      const c = canvasRef.current
      c.width = window.innerWidth
      c.height = window.innerHeight
      const ctx = c.getContext("2d")
      if (!ctx) return
      const st = ScrollTrigger.getById("seq")
      const idx = st ? Math.floor(st.progress * (frameCount - 1)) : 0
      const img = imagesRef.current[idx]
      if (img) draw(ctx, img)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [frameCount])

  // ——— ScrollTrigger ———
  useEffect(() => {
    if (!isLoaded || !imagesRef.current.length) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    if (imagesRef.current[0]) draw(ctx, imagesRef.current[0])

    const totalSections = stories.length + 2 // opener + stories + finale

    // 1. Image Sequence Timeline
    const obj = { frame: 0 }
    gsap.to(obj, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        id: "seq",
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: () => {
          const img = imagesRef.current[Math.floor(obj.frame)]
          if (img && ctx) draw(ctx, img)
        },
      },
    })

    // 2. Text Overlays Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })

    const opener = document.querySelector(".journey-opener") as HTMLElement
    const sections = gsap.utils.toArray(".story-section") as HTMLElement[]
    const finale = document.querySelector(".journey-finale") as HTMLElement

    const fadeInDur = 1
    const holdDur = 1.5
    const fadeOutDur = 1

    // Opener
    if (opener) {
      tl.to(opener, { opacity: 1, duration: fadeInDur })
      tl.to({}, { duration: holdDur }) // hold
      tl.to(opener, { opacity: 0, duration: fadeOutDur })
    }

    // Stories
    sections.forEach((section) => {
      tl.to(section, { opacity: 1, duration: fadeInDur })
      tl.to({}, { duration: holdDur }) // hold
      tl.to(section, { opacity: 0, duration: fadeOutDur })
    })

    // Finale
    if (finale) {
      tl.to(finale, { opacity: 1, duration: fadeInDur })
      tl.to({}, { duration: holdDur }) // hold
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [isLoaded, frameCount])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ minHeight: `${(stories.length + 3) * 100}vh` }}
      id="our-journey"
    >
      {/* ── Pinned Container ── */}
      <div className="sticky top-0 left-0 z-0 h-screen w-full overflow-hidden">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Cinematic overlays */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </div>

        {/* ── Text Content Layer (Absolute within sticky container) ── */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-6">
          {/* Opener */}
          <div className="journey-opener absolute flex flex-col items-center text-center opacity-0">
            <div className="mb-5 h-12 w-px bg-white/30" />
            <p className="mb-3 text-[10px] font-medium tracking-[0.5em] text-white/50 uppercase md:text-xs">
              Our Journey
            </p>
            <h2 className="mb-5 font-signature text-6xl leading-none text-white drop-shadow-lg md:text-8xl">
              Devi & Adhim
            </h2>
            <div className="mb-5 h-px w-12 bg-white/30" />
            <p className="max-w-sm font-serif text-sm leading-relaxed font-light tracking-wider text-white/60 md:text-base">
              Kisah perjalanan cinta yang membawa kami menuju janji suci
            </p>
          </div>

          {/* Story Sections */}
          {stories.map((s, i) => (
            <div
              key={i}
              className="story-section absolute flex max-w-lg flex-col items-center text-center opacity-0"
            >
              <span className="mb-4 text-[10px] font-medium tracking-[0.6em] text-white/30 uppercase">
                {s.num}
              </span>
              <div className="mb-6 h-px w-8 bg-white/20" />
              <span className="mb-4 font-signature text-4xl leading-none text-white drop-shadow-md md:text-6xl">
                {s.script}
              </span>
              <h3 className="mb-6 font-serif text-xl font-light tracking-[0.15em] text-white/90 uppercase md:text-3xl">
                {s.title}
              </h3>
              <p className="max-w-md font-serif text-sm leading-[2] font-light text-white/65 md:text-base">
                {s.body}
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-px w-6 bg-white/15" />
                <div className="h-1.5 w-1.5 rotate-45 border border-white/20" />
                <div className="h-px w-6 bg-white/15" />
              </div>
            </div>
          ))}

          {/* Finale */}
          <div className="journey-finale pointer-events-auto absolute flex max-w-lg flex-col items-center text-center opacity-0">
            <div className="mb-8 h-16 w-px bg-white/20" />
            <p className="mb-4 text-[10px] font-medium tracking-[0.5em] text-white/40 uppercase">
              Save the Date
            </p>
            <h2 className="mb-3 font-signature text-6xl leading-none text-white drop-shadow-lg md:text-8xl">
              25 . 12 . 2026
            </h2>
            <div className="my-6 h-px w-12 bg-white/25" />
            <p className="mb-10 max-w-sm font-serif text-sm leading-[2] font-light text-white/55 md:text-base">
              Dengan kerendahan hati dan limpahan kebahagiaan, kami mengundang
              Anda untuk hadir menjadi saksi perjalanan baru kami.
            </p>
            <a
              href="#hero-section"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-3 text-[11px] font-medium tracking-[0.2em] text-white/70 uppercase transition-all duration-300 hover:bg-white/10 hover:text-white"
            >
              Kembali ke Atas
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="-rotate-90"
              >
                <path
                  d="M5 1v8M5 1L2 4M5 1l3 3"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background transition-all duration-700">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border border-foreground/5" />
              <div className="absolute inset-0 animate-spin rounded-full border border-t-foreground/40" />
              <span className="absolute inset-0 flex items-center justify-center font-signature text-xl text-foreground/60">
                D&A
              </span>
            </div>
            <div>
              <p className="font-serif text-base font-light tracking-wider text-foreground/80">
                Memulai Kisah Perjalanan
              </p>
              <p className="mt-2 text-[10px] tracking-[0.3em] text-foreground/30 uppercase">
                {loadingProgress}%
              </p>
            </div>
            <div className="h-px w-40 overflow-hidden bg-foreground/5">
              <div
                className="h-full bg-foreground/30 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
