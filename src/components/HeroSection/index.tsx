"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Countdown } from "@/components/CountDown"
import { ChevronDown, Heart } from "lucide-react"
import Image from "next/image"
import { useImageUrl } from "@/store/useImageUrl"

const HeroSection = () => {
  const { resolvedTheme } = useTheme()
  const { imageUrl } = useImageUrl()
  const [mounted, setMounted] = useState(false)

  const isDark = resolvedTheme === "dark"
  const heroImage: any = isDark
    ? imageUrl.dark?.[0].link
    : imageUrl.light?.[0].link

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
    <header
      id="hero-section"
      className="relative h-screen w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 md:-translate-x-10 md:scale-125 dark:md:-translate-x-40"
          style={{ willChange: "transform" }}
        >
          <Image
            key={heroImage}
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
  )
}

export default HeroSection
