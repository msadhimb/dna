"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import useResponsive from "@/hooks/useResponsive"
import { useImageUrl } from "@/store/useImageUrl"

interface JourneySequenceProps {
  theme: string
}

export interface JourneySequenceRef {
  getTimeline: () => gsap.core.Timeline
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
        tl.set(journeyImgElement, { scale: 1, x: 0, y: 0, force3D: true }, 0)

        tl.to(journeyImageRef.current, {
          width: dist("85vw", "60vw"),
          height: dist("42vh", "60vh"),
          duration: 1,
          y: isMobile ? 0 : 100,
          ease: "none",
        })

        tl.to(
          textLeftRef.current,
          {
            x: dist("-5vw", "-12vw"),
            duration: 1,
            ease: "none",
          },
          "journeySplit"
        ).to(
          textRightRef.current,
          {
            x: dist("5vw", "12vw"),
            duration: 1,
            ease: "none",
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
            ease: "none",
          },
          "up"
        )
          .to(
            textLeftRef.current,
            {
              x: dist("-5vw", "-25vw"),
              duration: 1,
              ease: "none",
            },
            "up"
          )
          .to(
            textRightRef.current,
            {
              x: dist("5vw", "25vw"),
              duration: 1,
              ease: "none",
            },
            "up"
          )
          .to(
            textContainerRef.current,
            {
              y: (() => {
                const vh = window.innerHeight
                const initialTop = isMobile
                  ? Math.min(160, vh * 0.29 - 84)
                  : Math.min(176, vh * 0.3 - 104)
                const textH = textContainerRef.current?.offsetHeight ?? (isMobile ? 70 : 80)
                const imageUpY = isMobile ? 0 : 110
                const gapPush = 18
                return imageUpY - gapPush - textH - initialTop
              })(),
              duration: 1,
              ease: "none",
            },
            "up"
          )

        tl.to(
          journeyImageRef.current,
          {
            y: 0,
            borderRadius: "0px",
            duration: 1,
            ease: "none",
          },
          "gone"
        ).to(
          textContainerRef.current,
          {
            y: -300,
            duration: 1,
            ease: "none",
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
            ease: "none",
          },
          "zoomGroom"
        ).to(
          groomBioRef.current,
          {
            opacity: 1,
            duration: 1,
            ease: "none",
          },
          "zoomGroom+=0.5"
        )

        tl.to(
          groomBioRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: "none",
          },
          "zoomOut"
        ).to(
          journeyImgElement,
          {
            scale: 1,
            x: "0vw",
            y: "0vh",
            duration: 1.5,
            ease: "none",
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
            ease: "none",
          },
          "zoomBride"
        ).to(
          brideBioRef.current,
          {
            opacity: 1,
            duration: 1,
            ease: "none",
          },
          "zoomBride+=0.5"
        )

        tl.to({}, { duration: 1 })

        tl.to(brideBioRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "none",
        }).to(journeyImgElement, {
          x: "0vw",
          y: "0vh",
          scale: 1,
          duration: 1.5,
          ease: "none",
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
        className="gsap-element absolute z-10 flex flex-col items-center gap-4 text-center md:gap-6 top-[min(160px,calc(29vh-84px))] md:top-[min(176px,calc(30vh-104px))]"
      >
        <span className="font-sans text-[9px] font-medium tracking-[0.55em] text-muted uppercase md:text-xs">
          Our Story
        </span>
        <div className="flex gap-3 whitespace-nowrap md:gap-5">
          <h1
            ref={textLeftRef}
            id="journey-text-left"
            className="gsap-element inline-block text-muted font-sans text-3xl font-bold tracking-[0.15em] md:text-6xl md:tracking-[0.2em]"
          >
            {theme === "light" ? "FOREVER" : "ETERNAL"}
          </h1>
          <h1
            ref={textRightRef}
            id="journey-text-right"
            className="gsap-element inline-block text-muted font-sans text-3xl font-bold tracking-[0.15em]  md:text-6xl  dark:from-primary dark:via-primary dark:to-primary/70"
          >
            {theme === "light" ? "BEGINS" : "VOWS"}
          </h1>
        </div>
      </div>

      <div
        ref={journeyImageRef}
        className="gsap-element relative z-0 h-[42vh] w-[85vw] overflow-hidden rounded-2xl md:h-[40vh] md:w-[40vw] md:rounded-3xl"
        style={{ borderRadius: "24px" }}
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
          sizes="(max-width: 768px) 200vw, 150vw"
          quality={85}
          priority
          fetchPriority="high"
          className="journey-inner-img object-cover"
        />
      </div>

      {/* Groom Bio Overlay - bottom on mobile/tablet/landscape, side only on xl */}
      <div
        ref={groomBioRef}
        className={cn(
          "gsap-element absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
          "items-center justify-end text-center bg-linear-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
          "xl:inset-y-0 xl:bottom-auto xl:right-0 xl:left-auto xl:h-full xl:w-1/2 xl:items-end xl:justify-center xl:text-right xl:bg-linear-to-l xl:from-black/85 xl:via-black/45 xl:pt-0 xl:pb-0 xl:px-12",
          // landscape tablet/phone dengan tinggi kecil tetap bottom
          "max-[1024px]:landscape:inset-x-0 max-[1024px]:landscape:bottom-0 max-[1024px]:landscape:top-auto max-[1024px]:landscape:h-auto max-[1024px]:landscape:w-screen max-[1024px]:landscape:items-center max-[1024px]:landscape:justify-end max-[1024px]:landscape:text-center max-[1024px]:landscape:pt-24 max-[1024px]:landscape:pb-12"
        )}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#f2dfa0] uppercase sm:text-xs dark:text-muted">
          The Groom
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] sm:text-7xl  dark:text-primary">
          Muhamad Salman Adhim Baqy
        </h2>
        <span className="h-px w-16 bg-linear-to-r from-transparent via-[#d4af37] to-transparent xl:bg-linear-to-l xl:from-[#d4af37] xl:via-transparent xl:to-transparent xl:w-24 dark:via-primary xl:dark:from-primary" />

        <div className="mt-2 flex flex-col items-center gap-2 xl:items-end">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] dark:text-white italic uppercase sm:text-xs">
            Putra dari
          </p>

          <div className="flex flex-col items-center gap-0.5 xl:items-end">
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

          <div className="flex flex-col items-center xl:items-end gap-0.5">
            <p className="font-serif text-base leading-snug font-medium tracking-[0.03em] text-white md:text-xl">
              Christiana Sri Budhi H.
            </p>
            <p className="font-sans text-[10px] font-light tracking-[0.3em] text-white/60 uppercase md:text-[11px]">
              Ibu
            </p>
          </div>
        </div>
      </div>

      {/* Bride Bio Overlay - bottom on mobile/tablet/landscape, side only on xl */}
      <div
        ref={brideBioRef}
        className={cn(
          "gsap-element absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
          "items-center justify-end text-center bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
          "xl:inset-y-0 xl:bottom-auto xl:left-0 xl:right-auto xl:h-full xl:w-1/2 xl:items-start xl:justify-center xl:text-left xl:bg-gradient-to-r xl:from-black/85 xl:via-black/45 xl:pt-0 xl:pb-0 xl:px-12",
          "max-[1024px]:landscape:inset-x-0 max-[1024px]:landscape:bottom-0 max-[1024px]:landscape:top-auto max-[1024px]:landscape:h-auto max-[1024px]:landscape:w-screen max-[1024px]:landscape:items-center max-[1024px]:landscape:justify-end max-[1024px]:landscape:text-center max-[1024px]:landscape:pt-24 max-[1024px]:landscape:pb-12"
        )}
      >
        <span className="font-sans text-[10px] font-semibold tracking-[0.5em] text-[#f2dfa0] uppercase md:text-xs dark:text-muted">
          The Bride
        </span>
        <h2 className="font-signature text-5xl leading-[1.1] font-bold tracking-wide text-[#f2dfa0] [text-shadow:0_4px_20px_rgba(0,0,0,0.5)] md:text-7xl dark:text-primary">
          Devi Yuliana Nurhaliza
        </h2>
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent xl:bg-gradient-to-r xl:from-[#d4af37] xl:via-transparent xl:to-transparent xl:w-24 dark:via-primary xl:dark:from-primary" />

        <div className="mt-2 flex flex-col items-center gap-2 xl:items-start">
          <p className="font-serif text-[11px] font-normal tracking-[0.4em] text-[#e9cf7a] dark:text-white italic uppercase md:text-xs">
            Putri dari
          </p>

          <div className="flex flex-col items-center gap-0.5 xl:items-start">
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

          <div className="flex flex-col items-center xl:items-start gap-0.5">
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
