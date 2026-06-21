import React, { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export const WelcomeSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const text = textRef.current

    if (!container || !text) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=120%", // Slightly longer for a smoother transition
        scrub: true,
        pin: true,
        pinSpacing: false,
      },
    })

    // 1. Text fades and moves up quickly (parallax)
    tl.to(text, { y: -100, opacity: 0, duration: 0.5, ease: "power2.in" })
    
    // 2. The background wipes up smoothly using clip-path, revealing HeroSection underneath
    tl.fromTo(
      container,
      { clipPath: "inset(0% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 100% 0%)", duration: 0.8, ease: "power2.inOut" },
      "-=0.3" // Starts wiping while text is finishing its fade
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background z-10"
    >
      <div 
        ref={textRef} 
        className="flex w-full max-w-screen-lg flex-col items-center justify-center px-4 text-center"
      >
        <h1 className="mb-4 font-serif text-5xl font-bold tracking-widest text-foreground md:text-7xl">
          Welcome
        </h1>
        <p className="text-lg font-light uppercase tracking-[0.2em] text-foreground/70 md:text-xl">
          To Our Wedding
        </p>
      </div>
    </section>
  )
}
