"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import useResponsive from "@/hooks/useResponsive"

interface JourneySequenceProps {
  theme: string
}

export interface JourneySequenceRef {
  getTimeline: () => gsap.core.Timeline
}

const CLIP_RECT =
  "polygon(0% 0%, 33% 0%, 66% 0%, 100% 0%, 100% 50%, 100% 100%, 66% 100%, 33% 100%, 0% 100%, 0% 50%, 0% 25%, 0% 75%)"

export const JourneySequence = forwardRef<
  JourneySequenceRef,
  JourneySequenceProps
>(({ theme }, ref) => {
  const textLeftRef = useRef<HTMLHeadingElement>(null)
  const textRightRef = useRef<HTMLHeadingElement>(null)
  const journeyImageRef = useRef<HTMLDivElement>(null)
  const groomBioRef = useRef<HTMLDivElement>(null)
  const brideBioRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const { dist, isMobile } = useResponsive()

  useImperativeHandle(
    ref,
    () => ({
      getTimeline: () => {
        const tl = gsap.timeline()
        const journeyImgElement =
          journeyImageRef.current?.querySelector(".journey-inner-img")

        if (
          !journeyImageRef.current ||
          !textLeftRef.current ||
          !textRightRef.current ||
          !textContainerRef.current ||
          !journeyImgElement
        ) {
          return tl
        }

        tl.set([groomBioRef.current, brideBioRef.current], { opacity: 0 }, 0)
        tl.set(journeyImgElement, { scale: 1, x: 0, y: 0 }, 0)

        tl.to(journeyImageRef.current, {
          width: dist("85vw", "60vw"),
          height: dist("42vh", "60vh"),
          duration: 1,
          y: isMobile ? 0 : 100,
          ease: "power1.inOut",
        })

        tl.to(
          textLeftRef.current,
          {
            x: dist("-6vw", "-12vw"),
            duration: 1,
            ease: "power2.inOut",
          },
          "journeySplit"
        ).to(
          textRightRef.current,
          {
            x: dist("6vw", "12vw"),
            duration: 1,
            ease: "power2.inOut",
          },
          "journeySplit"
        )

        tl.to(
          journeyImageRef.current,
          {
            width: dist("200vw", "100vw"),
            height: "100vh",
            borderRadius: "0px",
            x: theme === "dark" ? 0 : dist("-30vw", "0"),
            y: dist("50", "90"),
            duration: 1,
            ease: "power2.inOut",
          },
          "up"
        )
          .to(
            textLeftRef.current,
            {
              x: dist("-18vw", "-30vw"),
              duration: 1,
              ease: "power2.inOut",
            },
            "up"
          )
          .to(
            textRightRef.current,
            {
              x: dist("18vw", "30vw"),
              duration: 1,
              ease: "power2.inOut",
            },
            "up"
          )
          .to(
            textContainerRef.current,
            {
              y: dist("-190", "-180"),
              duration: 1,
              ease: "power2.inOut",
            },
            "up"
          )

        tl.to(
          journeyImageRef.current,
          {
            y: 0,
            borderRadius: "0px",
            duration: 1,
            ease: "power2.inOut",
          },
          "gone"
        ).to(
          textContainerRef.current,
          {
            y: -300,
            duration: 1,
            ease: "power2.inOut",
          },
          "gone"
        )

        // zoom into groom image and show groom bio
        tl.to(
          journeyImgElement,
          {
            scale: isMobile ? 1.6 : 2,
            x:
              theme === "dark"
                ? dist("-35vw", "-35vw")
                : dist("-55vw", "-50vw"),
            y: theme === "dark" ? dist("-15vh", "20vh") : dist("20vh", "50vh"),
            duration: 1.5,
            ease: "power1.inOut",
          },
          "zoomGroom"
        ).to(
          groomBioRef.current,
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "zoomGroom+=0.5"
        )

        tl.to(
          groomBioRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          },
          "zoomOut"
        ).to(
          journeyImgElement,
          {
            scale: 1,
            x: "0vw",
            y: "0vh",
            duration: 1.5,
            ease: "power1.inOut",
          },
          "zoomOut"
        )

        tl.to(
          journeyImgElement,
          {
            scale: isMobile ? 1.6 : 2,
            x: theme === "dark" ? dist("35vw", "25vw") : dist("30vw", "20vw"),
            y: theme === "dark" ? dist("-15vh", "5vh") : dist("20vh", "40vh"),
            duration: 1.5,
            ease: "power1.inOut",
          },
          "zoomBride"
        ).to(
          brideBioRef.current,
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "zoomBride+=0.5"
        )

        tl.to({}, { duration: 1 })

        tl.to(brideBioRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        }).to(journeyImgElement, {
          x: "0vw",
          y: "0vh",
          scale: 1,
          duration: 1.5,
          ease: "power1.inOut",
        })

        tl.to({}, { duration: 1 })

        return tl
      },
    }),
    [theme, isMobile]
  )

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div
        ref={textContainerRef}
        id="journey-text-container"
        className="gsap-element absolute top-40 z-10 flex flex-col items-center gap-4 text-center md:gap-6"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.55em] text-[#d4af37]/70 uppercase md:text-xs dark:text-primary/70">
          Our Story
        </span>
        <div className="flex gap-3 whitespace-nowrap md:gap-5">
          <h1
            ref={textLeftRef}
            id="journey-text-left"
            className="gsap-element inline-block bg-gradient-to-b from-[#f2dfa0] via-[#d4af37] to-[#a1811f] bg-clip-text font-signature text-4xl font-bold tracking-[0.15em] text-transparent [text-shadow:0_2px_12px_rgba(0,0,0,0.25)]  md:text-5xl md:tracking-[0.2em] dark:from-primary dark:via-primary dark:to-primary/70"
          >
            {theme === "light" ? "Forever" : "Eternal"}
          </h1>
          <h1
            ref={textRightRef}
            id="journey-text-right"
            className="gsap-element inline-block bg-gradient-to-b from-[#f2dfa0] via-[#d4af37] to-[#a1811f] bg-clip-text font-signature text-4xl font-bold tracking-[0.15em] text-transparent [text-shadow:0_2px_12px_rgba(0,0,0,0.25)]  md:text-5xl md:tracking-[0.2em] dark:from-primary dark:via-primary dark:to-primary/70"
          >
            {theme === "light" ? "Begins" : "Vows"}
          </h1>
        </div>
      </div>

      <div
        ref={journeyImageRef}
        className="gsap-element relative z-0 h-[42vh] w-[85vw] overflow-hidden rounded-2xl md:h-[40vh] md:w-[40vw] md:rounded-3xl"
        style={{ borderRadius: "24px", clipPath: CLIP_RECT }}
      >
        <Image
          src={
            theme === "dark"
              ? "/asset/pre-wed/image/dark/6.jpg"
              : "/asset/pre-wed/image/light/4.jpg"
          }
          fill
          alt="Journey"
          sizes="(max-width: 768px) 400vw, 220vw"
          quality={100}
          priority
          className="journey-inner-img object-cover"
        />
      </div>

      {/* Groom Bio Overlay (Left Side) */}
      <div
        ref={groomBioRef}
        className={cn(
          "gsap-element absolute inset-y-0 right-0 z-50 flex w-screen flex-col items-end justify-center gap-3 bg-linear-to-l from-black/85 via-black/45 to-transparent p-6 text-right opacity-0 sm:p-8 md:w-1/2 md:p-12"
        )}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#d4af37]/80 uppercase md:text-xs dark:text-primary/80">
          The Groom
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-7xl  dark:text-primary">
          Muhamad Salman Adhim Baqy
        </h2>
        <span className="h-px w-16 bg-gradient-to-l from-[#d4af37] to-transparent md:w-24 dark:from-primary" />

        <div className="mt-2 flex flex-col items-end gap-2">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] italic uppercase md:text-xs">
            Putra dari
          </p>

          <div className="flex flex-col items-end gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Suprapto Wibowo
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Bapak
            </p>
          </div>

          <span className="font-signature my-0.5 text-2xl leading-none text-[#e9cf7a] md:text-3xl">
            &
          </span>

          <div className="flex flex-col items-end gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Christiana Sri Budhi Handayaniningsih
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Ibu
            </p>
          </div>
        </div>
      </div>

      {/* Bride Bio Overlay (Right Side) */}
      <div
        ref={brideBioRef}
        className={cn(
          "gsap-element absolute inset-y-0 left-0 z-50 flex w-screen flex-col items-start justify-center gap-3 bg-linear-to-r from-black/85 via-black/45 to-transparent p-6 text-left opacity-0 sm:p-8 md:w-1/2 md:p-12"
        )}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#d4af37]/80 uppercase md:text-xs dark:text-primary/80">
          The Bride
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-7xl dark:text-primary">
          Devi Yuliana Nurhaliza
        </h2>
        <span className="h-px w-16 bg-gradient-to-r from-[#d4af37] to-transparent md:w-24 dark:from-primary" />

        <div className="mt-2 flex flex-col items-start gap-2">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] italic uppercase md:text-xs">
            Putri dari
          </p>

          <div className="flex flex-col items-start gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Deden Herman Kuriawan
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Bapak
            </p>
          </div>

          <span className="font-signature my-0.5 text-2xl leading-none text-[#e9cf7a] md:text-3xl">
            &
          </span>

          <div className="flex flex-col items-start gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Selvia Agustina Damayanti
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Ibu
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

JourneySequence.displayName = "JourneySequence"
export default JourneySequence
