"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"
import { cn } from "@/lib/utils"
import useResponsive from "@/hooks/useResponsive"
import { useImageUrl } from "@/store/useImageUrl"

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
  const { imageUrl } = useImageUrl()

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
        // force-promote ke GPU compositor layer sejak awal agar scale tidak trigger repaint
        tl.set(
          journeyImgElement,
          { scale: 1, x: 0, y: 0, z: 0.01, force3D: true },
          0
        )

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
            x: dist("-5vw", "-12vw"),
            duration: 1,
            ease: "power2.inOut",
          },
          "journeySplit"
        ).to(
          textRightRef.current,
          {
            x: dist("5vw", "12vw"),
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
            clipPath: "none",
            x: theme === "dark" ? 0 : dist("-30vw", "0"),
            y: dist("0", "110"),
            duration: 1,
            ease: "power2.inOut",
          },
          "up"
        )
          .to(
            textLeftRef.current,
            {
              x: dist("-5vw", "-25vw"),
              duration: 1,
              ease: "power2.inOut",
            },
            "up"
          )
          .to(
            textRightRef.current,
            {
              x: dist("5vw", "25vw"),
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
        className="gsap-element absolute top-40 md:top-44 z-10 flex flex-col items-center gap-4 text-center md:gap-6"
        style={{ willChange: "transform" }}
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.55em] text-muted uppercase md:text-xs">
          Our Story
        </span>
        <div className="flex gap-3 whitespace-nowrap md:gap-5">
          <h1
            ref={textLeftRef}
            id="journey-text-left"
            className="gsap-element inline-block text-muted font-sans text-3xl font-bold tracking-[0.15em] md:text-7xl md:tracking-[0.2em]"
          >
            {theme === "light" ? "FOREVER" : "ETERNAL"}
          </h1>
          <h1
            ref={textRightRef}
            id="journey-text-right"
            className="gsap-element inline-block text-muted font-sans text-3xl font-bold tracking-[0.15em]  md:text-7xl  dark:from-primary dark:via-primary dark:to-primary/70"
          >
            {theme === "light" ? "BEGINS" : "VOWS"}
          </h1>
        </div>
      </div>

      <div
        ref={journeyImageRef}
        className="gsap-element relative z-0 h-[42vh] w-[85vw] overflow-hidden rounded-2xl md:h-[40vh] md:w-[40vw] md:rounded-3xl"
        style={{
          borderRadius: "24px",
          willChange: "transform",
        }}
      >
        <Image
          key={
            theme === "dark"
              ? (imageUrl as any).dark?.[5]?.link
              : (imageUrl as any).light?.[3]?.link
          }
          src={
            theme === "dark"
              ? (imageUrl as any).dark?.[5]?.link
              : (imageUrl as any).light?.[3]?.link
          }
          fill
          alt="Journey"
          sizes="(max-width: 768px) 400vw, 220vw"
          quality={100}
          priority
          className="journey-inner-img object-cover"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        />
      </div>

      {/* Groom Bio Overlay (Left Side) */}
      <div
        ref={groomBioRef}
        className={cn(
          "gsap-element absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
          // Mobile: full-width panel sliding from bottom, gradient from bottom, centered text
          "items-center justify-end text-center bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
          // Desktop: right-side panel, gradient from left, right-aligned text
          "md:inset-y-0 md:bottom-auto md:right-0 md:left-auto md:h-full md:w-1/2 md:items-end md:justify-center md:text-right md:bg-gradient-to-l md:from-black/85 md:via-black/45 md:pt-0 md:pb-0 md:px-12"
        )}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#f2dfa0] uppercase md:text-xs dark:text-muted">
          The Groom
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-7xl  dark:text-primary">
          Muhamad Salman Adhim Baqy
        </h2>
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent md:bg-gradient-to-l md:from-[#d4af37] md:via-transparent md:to-transparent md:w-24 dark:via-primary md:dark:from-primary" />

        <div className="mt-2 flex flex-col items-center gap-2 md:items-end">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] dark:text-white italic uppercase md:text-xs">
            Putra dari
          </p>

          <div className="flex flex-col items-center gap-0.5 md:items-end">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Suprapto Wibowo
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Bapak
            </p>
          </div>

          <span className="font-signature my-0.5 text-2xl leading-none text-[#e9cf7a] dark:text-white md:text-3xl">
            &
          </span>

          <div className="flex flex-col items-center md:items-end gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Christiana Sri Budhi H.
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
          "gsap-element absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
          // Mobile: full-width panel sliding from bottom, gradient from bottom, centered text
          "items-center justify-end text-center bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
          // Desktop: left-side panel, gradient from right, left-aligned text
          "md:inset-y-0 md:bottom-auto md:left-0 md:right-auto md:h-full md:w-1/2 md:items-start md:justify-center md:text-left md:bg-gradient-to-r md:from-black/85 md:via-black/45 md:pt-0 md:pb-0 md:px-12"
        )}
        style={{ willChange: "transform" }}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#f2dfa0] uppercase md:text-xs dark:text-muted">
          The Bride
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-7xl dark:text-primary">
          Devi Yuliana Nurhaliza
        </h2>
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent md:bg-gradient-to-r md:from-[#d4af37] md:via-transparent md:to-transparent md:w-24 dark:via-primary md:dark:from-primary" />

        <div className="mt-2 flex flex-col items-center gap-2 md:items-start">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] dark:text-white italic uppercase md:text-xs">
            Putri dari
          </p>

          <div className="flex flex-col items-center gap-0.5 md:items-start">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Deden Herman K.
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Bapak
            </p>
          </div>

          <span className="font-signature my-0.5 text-2xl leading-none text-[#e9cf7a] dark:text-white md:text-3xl">
            &
          </span>

          <div className="flex flex-col items-center md:items-start gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Selvia A. D.
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
