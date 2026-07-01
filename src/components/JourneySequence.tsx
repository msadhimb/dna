"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"
import { Flower, Flower2, Sparkle, Sparkles } from "lucide-react"
import { useScreenWidth } from "@/hooks/useScreenWidth"
import { cn } from "@/lib/utils"

interface JourneySequenceProps {
  theme: string
}

export interface JourneySequenceRef {
  getTimeline: () => gsap.core.Timeline
}

/** Small ornamental flourish used to break up empty space around the
 *  couple's names and beneath the title. Inherits color via currentColor
 *  so it automatically follows the light/dark palette. */
function FloralOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 12 H40" />
      <path d="M80 12 H118" />
      <circle cx="60" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M60 12 C52 4, 44 4, 40 12 C44 20, 52 20, 60 12 Z" />
      <path d="M60 12 C68 4, 76 4, 80 12 C76 20, 68 20, 60 12 Z" />
    </svg>
  )
}

/** Slightly larger flourish used for the mid-edge accents in the
 *  page-level decoration layer. */
function EdgeOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 80"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 4 V30" />
      <path d="M12 50 V76" />
      <circle cx="12" cy="40" r="3.5" fill="currentColor" stroke="none" />
      <path d="M12 40 C6 34, 4 26, 8 20" />
      <path d="M12 40 C18 34, 20 26, 16 20" />
      <path d="M12 40 C6 46, 4 54, 8 60" />
      <path d="M12 40 C18 46, 20 54, 16 60" />
    </svg>
  )
}

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
  const screenWidth = useScreenWidth()
  const isMobile = screenWidth > 0 && screenWidth < 768

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

        const dist = (mobileVal: string, desktopVal: string) =>
          isMobile ? mobileVal : desktopVal

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
                ? dist("-35vw", "-45vw")
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

        return tl
      },
    }),
    [theme, isMobile]
  )

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-40 text-[#d4af37]/70 dark:text-primary/70">
        <Sparkles
          className="absolute top-4 left-4 h-8 w-8 drop-shadow-lg md:top-6 md:left-6 md:h-11 md:w-11"
          strokeWidth={1.25}
        />
        <Sparkles
          className="absolute top-4 right-4 h-8 w-8 -scale-x-100 drop-shadow-lg md:top-6 md:right-6 md:h-11 md:w-11"
          strokeWidth={1.25}
        />
        <Sparkles
          className="absolute bottom-4 left-4 h-8 w-8 -scale-y-100 drop-shadow-lg md:bottom-6 md:left-6 md:h-11 md:w-11"
          strokeWidth={1.25}
        />
        <Sparkles
          className="absolute right-4 bottom-4 h-8 w-8 -scale-100 drop-shadow-lg md:right-6 md:bottom-6 md:h-11 md:w-11"
          strokeWidth={1.25}
        />
        <EdgeOrnament className="absolute top-1/2 left-2 hidden h-16 w-6 -translate-y-1/2 drop-shadow-lg sm:block md:left-4 md:h-24 md:w-8" />
        <EdgeOrnament className="absolute top-1/2 right-2 hidden h-16 w-6 -translate-y-1/2 drop-shadow-lg sm:block md:right-4 md:h-24 md:w-8" />

        <Flower
          className="absolute top-14 left-8 h-5 w-5 opacity-60 drop-shadow md:top-20 md:left-16 md:h-7 md:w-7"
          strokeWidth={1.25}
        />
        <Flower2
          className="absolute top-24 right-10 h-4 w-4 -rotate-12 opacity-50 drop-shadow md:top-32 md:right-20 md:h-6 md:w-6"
          strokeWidth={1.25}
        />
        <Flower2
          className="absolute bottom-20 left-10 h-4 w-4 rotate-6 opacity-50 drop-shadow md:bottom-28 md:left-20 md:h-6 md:w-6"
          strokeWidth={1.25}
        />
        <Flower
          className="absolute right-8 bottom-14 h-5 w-5 rotate-12 opacity-60 drop-shadow md:right-16 md:bottom-20 md:h-7 md:w-7"
          strokeWidth={1.25}
        />
        <Sparkle
          className="absolute top-1/3 left-4 hidden h-4 w-4 opacity-40 sm:block md:left-10 md:h-5 md:w-5"
          strokeWidth={1.25}
        />
        <Sparkle
          className="absolute top-2/3 right-4 hidden h-4 w-4 opacity-40 sm:block md:right-10 md:h-5 md:w-5"
          strokeWidth={1.25}
        />
      </div>

      <div
        ref={textContainerRef}
        id="journey-text-container"
        className="gsap-element absolute top-50 z-10 flex flex-col items-center gap-2 text-center md:top-48 md:gap-4"
      >
        <div className="flex gap-3 whitespace-nowrap md:gap-4">
          <h1
            ref={textLeftRef}
            id="journey-text-left"
            className="gsap-element inline-block font-signature text-2xl font-bold tracking-[0.2em] text-muted drop-shadow-lg sm:text-3xl md:text-7xl md:tracking-[0.3em] dark:text-primary"
          >
            {theme === "light" ? "Forever" : "Eternal"}
          </h1>
          <h1
            ref={textRightRef}
            id="journey-text-right"
            className="gsap-element inline-block font-signature text-2xl font-bold tracking-[0.2em] text-muted drop-shadow-lg sm:text-3xl md:text-7xl md:tracking-[0.3em] dark:text-primary"
          >
            {theme === "light" ? "Begins" : "Vows"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <FloralOrnament className="h-4 w-14 text-[#d4af37] opacity-80 md:h-6 md:w-24 dark:text-primary" />
          <Flower2
            className="h-4 w-4 text-[#d4af37] opacity-90 md:h-5 md:w-5 dark:text-primary"
            strokeWidth={1.25}
          />
          <FloralOrnament className="h-4 w-14 rotate-180 text-[#d4af37] opacity-80 md:h-6 md:w-24 dark:text-primary" />
        </div>
      </div>

      <div
        ref={journeyImageRef}
        className="gsap-element relative z-0 h-[42vh] w-[85vw] overflow-hidden rounded-2xl md:h-[40vh] md:w-[40vw] md:rounded-3xl"
        style={{ borderRadius: "24px" }}
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
          "gsap-element absolute inset-y-0 right-0 z-50 flex w-screen flex-col items-end justify-center gap-2 bg-linear-to-l from-black/80 via-black/40 to-transparent p-6 text-right opacity-0 sm:p-8 md:w-1/2 md:p-12"
        )}
      >
        <div className="flex items-center gap-2">
          <FloralOrnament className="h-4 w-12 text-[#d4af37] md:h-5 md:w-20 dark:text-primary" />
          <Flower
            className="h-4 w-4 text-[#d4af37] md:h-5 md:w-5 dark:text-primary"
            strokeWidth={1.25}
          />
        </div>
        <h2 className="font-signature text-4xl font-bold tracking-wide text-[#d4af37] drop-shadow-xl sm:text-4xl md:text-6xl lg:text-8xl dark:text-primary">
          Muhamad Salman Adhim Baqy
        </h2>
        <p className="text-md font-serif text-sm leading-relaxed font-light tracking-widest text-white drop-shadow-md">
          Putra dari Bapak Suprapto Wibowo <br /> & Ibu Christiana Sri Budhi
          Handayaniningsih
        </p>
      </div>

      {/* Bride Bio Overlay (Right Side) */}
      <div
        ref={brideBioRef}
        className={cn(
          "gsap-element absolute inset-y-0 left-0 z-50 flex w-screen flex-col items-start justify-center gap-2 bg-linear-to-r from-black/80 via-black/40 to-transparent p-6 text-left opacity-0 sm:p-8 md:w-1/2 md:p-12"
        )}
      >
        <div className="flex items-center gap-2">
          <Flower
            className="h-4 w-4 text-[#d4af37] md:h-5 md:w-5 dark:text-primary"
            strokeWidth={1.25}
          />
          <FloralOrnament className="h-4 w-12 text-[#d4af37] md:h-5 md:w-20 dark:text-primary" />
        </div>
        <h2 className="font-signature text-4xl font-bold tracking-wide text-[#d4af37] drop-shadow-xl sm:text-4xl md:text-6xl lg:text-8xl dark:text-primary">
          Devi Yuliana Nurhaliza
        </h2>
        <p className="text-md font-serif text-sm leading-relaxed font-light tracking-widest text-white drop-shadow-md sm:text-base">
          Putri dari Bapak Deden Herman Kuriawan <br /> & Ibu Selvia Agustina
          Damayantid
        </p>
      </div>
    </div>
  )
})

JourneySequence.displayName = "JourneySequence"
export default JourneySequence
