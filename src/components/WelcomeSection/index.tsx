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

    const isMobile = window.innerWidth < 768

    // Gunakan transform-based exit (GPU composited) bukan clipPath
    // clipPath menyebabkan repaint per-frame di mobile → jank
    // scaleY + transformOrigin adalah compositor-only → smooth
    gsap.set(container, {
      transformOrigin: "top center",
      force3D: true,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: isMobile ? "+=50%" : "+=100%",
        scrub: isMobile ? 2.5 : 1.5,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1, // Cegah pin jump saat masuk ke section berikutnya
        invalidateOnRefresh: true,
      },
    })

    // 1. Text fade out + slide up
    tl.to(text, {
      y: -60,
      opacity: 0,
      duration: 0.4,
      ease: "none",
      force3D: true,
    })
    // 2. Container wipe up via scaleY (GPU composited)
    tl.to(
      container,
      {
        scaleY: 0,
        duration: 0.6,
        ease: "none",
        force3D: true,
      },
      "-=0.1"
    )

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="gsap-element relative z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background"
      style={{ willChange: "transform", transformOrigin: "top center" }}
    >
      <div
        ref={textRef}
        className="gsap-element flex w-full max-w-screen-lg flex-col items-center justify-center px-4 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h1 className="mb-4 font-serif text-5xl font-bold tracking-widest text-foreground md:text-7xl">
          Welcome
        </h1>
        <p className="text-lg font-light tracking-[0.2em] text-foreground/70 uppercase md:text-xl">
          To Our Wedding
        </p>
      </div>
    </section>
  )
}
