"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Countdown } from "@/components/Countdown"
import { ChevronDown, Heart } from "lucide-react"
import Image from "next/image"

const HeroSection = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggleTheme = (checked: boolean) => setTheme(checked ? "dark" : "light")

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  const isDark = resolvedTheme === "dark"
  const heroImage = isDark
    ? "/asset/pre-wed/image/dark/1.jpg"
    : "/asset/pre-wed/image/light/1.jpg"

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Heart className="h-6 w-6 animate-pulse text-foreground/20" />
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-foreground/10">
      {/* <audio ref={audioRef} loop />
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/30 text-white/70 backdrop-blur-md transition-all duration-300 hover:bg-muted/40 hover:text-white"
          aria-label="Toggle Music"
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-1.5 rounded-full bg-muted/30 px-2.5 py-1.5 backdrop-blur-md">
          <Sun className="h-3.5 w-3.5 text-white/50" />
          <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            aria-label="Toggle Theme"
          />
          <Moon className="h-3.5 w-3.5 text-white/50" />
        </div>
      </div> */}

      <header
        id="hero-section"
        className="relative h-screen w-full overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 md:-translate-x-10 md:scale-125 dark:md:-translate-x-40">
            <Image
              src={heroImage}
              alt="Devi & Adhim"
              fill
              priority
              className="object-cover object-[80%_70%] dark:object-[60%_0%]"
              sizes="(max-width: 768px) 400vw, 220vw"
            />
          </div>
          {/* Overlays */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-16">
          {/* Top — label */}
          <div className="animate-fade-up animation-delay-200 opacity-0">
            <p className="text-[10px] font-medium tracking-[0.4em] text-primary-foreground uppercase md:text-xs dark:text-primary">
              The Wedding Of
            </p>
          </div>

          {/* Center — Names */}
          <div className="flex flex-col items-center gap-3">
            <h1 className="animate-fade-up animation-delay-400 font-signature text-7xl leading-none text-primary opacity-0 drop-shadow-lg md:text-9xl">
              Devi
            </h1>
            <span className="animate-fade-in animation-delay-600 font-serif text-xl font-light text-primary italic opacity-0 md:text-2xl">
              &
            </span>
            <h1 className="animate-fade-up animation-delay-600 font-signature text-7xl leading-none text-primary opacity-0 drop-shadow-lg md:text-9xl">
              Adhim
            </h1>

            {/* Ornamental divider */}
            <div className="animate-fade-in animation-delay-800 mt-4 flex items-center gap-4 opacity-0">
              <div className="h-px w-12 bg-primary" />
              <div className="h-1.5 w-1.5 rotate-45 border border-primary" />
              <div className="h-px w-12 bg-primary" />
            </div>

            {/* Date */}
            <p className="animate-fade-up animation-delay-1000 mt-2 font-serif text-xl tracking-[0.3em] text-primary opacity-0 md:text-2xl dark:font-bold">
              12 • 12 • 2026
            </p>
          </div>

          {/* Bottom — Countdown + scroll CTA */}
          <div className="animate-fade-up animation-delay-1000 flex flex-col items-center gap-8 opacity-0">
            {/* Countdown */}
            <div className="text-white">
              <Countdown targetDate="2026-12-12T09:00:00" />
            </div>

            {/* Scroll hint */}
            <a
              href="#our-journey"
              className="group flex flex-col items-center gap-2 text-primary"
            >
              <span className="text-[9px] font-medium tracking-[0.4em] uppercase transition-colors group-hover:text-white/60">
                Mulai Perjalanan
              </span>
              <ChevronDown className="animate-gentle-bounce h-4 w-4 text-primary transition-colors group-hover:text-white/60" />
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}

export default HeroSection
