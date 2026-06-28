"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"

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

        tl.to(journeyImageRef.current, {
          width: "60vw",
          height: "60vh",
          duration: 1,
          y: 100,
          ease: "power1.inOut",
        })

        tl.to(
          textLeftRef.current,
          {
            x: "-30vw",
            duration: 1,
            ease: "power2.inOut",
          },
          "journeySplit"
        ).to(
          textRightRef.current,
          {
            x: "30vw",
            duration: 1,
            ease: "power2.inOut",
          },
          "journeySplit"
        )

        tl.to(
          journeyImageRef.current,
          {
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
            duration: 1,
            ease: "power2.inOut",
          },
          "up"
        ).to(
          textContainerRef.current,
          {
            y: -180,
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

        tl.to(
          journeyImgElement,
          {
            scale: 2,
            x: theme === "dark" ? "-35vw" : "-50vw",
            y: theme === "dark" ? "20vh" : "50vh",
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
            scale: 2,
            x: theme === "dark" ? "25vw" : "15vw",
            y: theme === "dark" ? "5vh" : "15vh",
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
    [theme]
  )

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div
        ref={textContainerRef}
        id="journey-text-container"
        className="absolute top-48 z-10 flex gap-4 text-center whitespace-nowrap"
      >
        <h1
          ref={textLeftRef}
          id="journey-text-left"
          className="inline-block font-signature text-5xl font-bold tracking-[0.3em] text-muted drop-shadow-lg md:text-7xl dark:text-primary"
        >
          {theme === "light" ? "Forever" : "Eternal"}
        </h1>
        <h1
          ref={textRightRef}
          id="journey-text-right"
          className="dr op-shadow-lg inline-block font-signature text-5xl font-bold tracking-[0.3em] text-muted md:text-7xl dark:text-primary"
        >
          {theme === "light" ? "Begins" : "Vows"}
        </h1>
      </div>

      <div
        ref={journeyImageRef}
        className="relative z-0 overflow-hidden"
        style={{ width: "40vw", height: "40vh", borderRadius: "24px" }}
      >
        <Image
          src={
            theme === "dark"
              ? "/asset/pre-wed/image/dark/6.jpg"
              : "/asset/pre-wed/image/light/4.jpg"
          }
          fill
          alt="Journey"
          sizes="100vw"
          quality={100}
          className="journey-inner-img object-cover"
        />

        {/* Groom Bio Overlay (Left Side) */}
        <div
          ref={groomBioRef}
          className="absolute inset-y-0 right-0 z-10 flex w-full flex-col justify-center bg-linear-to-l from-black/80 via-black/40 to-transparent p-12 text-right opacity-0 md:w-1/2"
        >
          <h2 className="mb-4 font-signature text-6xl font-bold tracking-wide text-[#d4af37] drop-shadow-xl md:text-8xl dark:text-primary">
            Muhamad Salman Adhim Baqy
          </h2>
          <p className="text-md md:text-md font-serif leading-relaxed font-light tracking-widest text-white drop-shadow-md">
            Putra dari Bapak Suprapto Wibowo <br /> & Ibu Christiana Sri Budhi
            Handayaniningsih
          </p>
        </div>

        {/* Bride Bio Overlay (Right Side) */}
        <div
          ref={brideBioRef}
          className="absolute inset-y-0 left-0 z-10 flex w-full flex-col justify-center bg-linear-to-r from-black/80 via-black/40 to-transparent p-12 text-left opacity-0 md:w-1/2"
        >
          <h2 className="mb-4 font-signature text-6xl font-bold tracking-wide text-[#d4af37] drop-shadow-xl md:text-8xl dark:text-primary">
            Devi Yuliana Nurhaliza
          </h2>
          <p className="md:text-md font-serif text-lg leading-relaxed font-light tracking-widest text-white drop-shadow-md">
            Putri dari Bapak Deden Herman Kuriawan <br /> & Ibu Selvia Putri
            Agustina
          </p>
        </div>
      </div>
    </div>
  )
})

JourneySequence.displayName = "JourneySequence"
export default JourneySequence
