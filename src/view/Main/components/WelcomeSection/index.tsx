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
        end: "+=100%", // 1 viewport height to scroll through
        scrub: true,
        pin: true,
        pinSpacing: false, // Allows the hero section below it to scroll up and replace it!
      },
    })

    // Fade out and move text up as user scrolls
    tl.to(text, { y: -50, opacity: 0, duration: 1 })
    
    // Optional: add a slight shadow/darken to the background as it gets covered
    tl.to(container, { opacity: 0, duration: 0.5 }, "-=0.5")

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
