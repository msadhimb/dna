"use client"

import Image from "next/image"
import { useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import useResponsive from "@/hooks/useResponsive"
import { useImageUrl } from "@/store/useImageUrl"
import Header from "../Header"

interface BioSequenceProps {
  theme: string
}

export interface BioSequenceRef {
  getTimeline: () => gsap.core.Timeline
}

export const BioSequence = forwardRef<BioSequenceRef, BioSequenceProps>(
  ({ theme }, ref) => {
    const journeyImageRef = useRef<HTMLDivElement>(null)
    const groomBioRef = useRef<HTMLDivElement>(null)
    const brideBioRef = useRef<HTMLDivElement>(null)
    const { dist, isMobile } = useResponsive()
    const { imageUrl } = useImageUrl()

    const isDark = theme === "dark"

    useImperativeHandle(
      ref,
      () => ({
        getTimeline: () => {

          const tl = gsap.timeline({ defaults: { ease: "none" } })
          const journeyImgElement =
            journeyImageRef.current?.querySelector(".journey-inner-img")

          if (!journeyImageRef.current || !journeyImgElement) {
            return tl
          }

          const groomScale = isMobile ? 1.6 : 2
          const brideScale = isMobile ? 1.6 : 2

          tl.set(
            [groomBioRef.current, brideBioRef.current],
            { autoAlpha: 0 },
            0
          )
          tl.set(
            journeyImageRef.current,
            {
              width: dist("200vw", "100vw"),
              height: "100vh",
              borderRadius: "0px",
              clipPath: "none",
              x: isDark ? 0 : dist("-25vw", "0"),
              y: 0,
            },
            0
          )
          tl.set(
            journeyImgElement,
            { scale: 1, x: "0vw", y: "0vh", opacity: 1, force3D: true },
            0
          )

          tl.to(
            journeyImgElement,
            {
              scale: groomScale,
              x:
                theme === "dark"
                  ? dist("-35vw", "-35vw")
                  : dist("-55vw", "-50vw"),
              y:
                theme === "dark" ? dist("-15vh", "20vh") : dist("20vh", "50vh"),
              duration: 1.5,
              force3D: true,
            },
            0.2
          ).to(
            groomBioRef.current,
            { autoAlpha: 1, duration: 0.8, force3D: false },
            0.7
          )

          tl.to(
            groomBioRef.current,
            { autoAlpha: 0, duration: 0.6, force3D: false },
            2.0
          ).to(
            journeyImgElement,
            {
              scale: 1,
              x: "0vw",
              y: "0vh",
              duration: 1.2,
              force3D: true,
            },
            2.0
          )

          tl.to(
            journeyImgElement,
            {
              scale: brideScale,
              x: theme === "dark" ? dist("35vw", "25vw") : dist("30vw", "20vw"),
              y: theme === "dark" ? dist("-15vh", "5vh") : dist("20vh", "40vh"),
              duration: 1.5,
              force3D: true,
            },
            3.2
          ).to(
            brideBioRef.current,
            { autoAlpha: 1, duration: 0.8, force3D: false },
            3.7
          )

          tl.to(
            brideBioRef.current,
            { autoAlpha: 0, duration: 0.6, force3D: false },
            5.1
          ).to(
            journeyImgElement,
            {
              x: "0vw",
              y: "0vh",
              scale: 1,
              duration: 1.0,
              force3D: true,
            },
            5.1
          )

          return tl
        },
      }),
      [theme, isMobile]
    )

    const journeySrc = isDark
      ? imageUrl.dark?.[5]?.link
      : imageUrl.light?.[3]?.link

    useEffect(() => {
      const el = journeyImageRef.current
      if (!el) return
      const w = window.innerWidth
      const h = window.innerHeight
      const mobile = w < 768 || (w <= 1024 && h > w)
      const d = (m: string, dk: string) => (mobile ? m : dk)
      gsap.set(el, {
        width: d("200vw", "100vw"),
        height: "100vh",
        borderRadius: "0px",
        clipPath: "none",
        x: isDark ? 0 : d("-25vw", "0"),
        y: 0,
      })
    }, [isDark, isMobile])

    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <div
          ref={journeyImageRef}
          className="gsap-element relative z-0 h-screen w-screen overflow-hidden"
          style={{
            borderRadius: "0px",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
          }}
        >
          {journeySrc ? (
            <Image
              key={journeySrc}
              src={journeySrc}
              fill
              alt="Journey"
              quality={75}
              priority
              fetchPriority="high"
              decoding="async"

              unoptimized
              className="journey-inner-img object-cover"
            />
          ) : null}
        </div>

        <div
          ref={groomBioRef}
          className={cn(

            "gsap-element pointer-events-none invisible absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
            "items-center justify-end text-center bg-linear-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
            "xl:inset-y-0 xl:bottom-auto xl:right-0 xl:left-auto xl:h-full xl:w-1/2 xl:items-end xl:justify-center xl:text-right xl:bg-linear-to-l xl:from-black/85 xl:via-black/45 xl:pt-0 xl:pb-0 xl:px-12",

            "max-[1024px]:landscape:inset-x-0 max-[1024px]:landscape:bottom-0 max-[1024px]:landscape:top-auto max-[1024px]:landscape:h-auto max-[1024px]:landscape:w-screen max-[1024px]:landscape:items-center max-[1024px]:landscape:justify-end max-[1024px]:landscape:text-center max-[1024px]:landscape:pt-24 max-[1024px]:landscape:pb-12"
          )}
        >
          <Header
            subHeader="The Groom"
            title="Muhamad Salman Adhim Baqy"
            subTitle="Putra Ketiga dari Bapak Suprapto Wibowo dan Ibu Christiana Sri Budhi H"

            className="text-white py-10"
            classNameTitle="text-[#f2dfa0] dark:text-primary text-5xl w-full"
            classNameSubTitle="text-md md:text-xl opacity-75"
            spaceY={3}
            separator={
              <span className="h-px w-16 bg-linear-to-r from-transparent via-[#d4af37] to-transparent xl:bg-linear-to-l xl:from-[#d4af37] xl:via-transparent xl:to-transparent xl:w-24 dark:via-primary xl:dark:from-primary" />
            }
          />
        </div>

        <div
          ref={brideBioRef}
          className={cn(
            "gsap-element pointer-events-none invisible absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
            "items-center justify-end text-center bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
            "xl:inset-y-0 xl:bottom-auto xl:left-0 xl:right-auto xl:h-full xl:w-1/2 xl:items-start xl:justify-center xl:text-left xl:bg-gradient-to-r xl:from-black/85 xl:via-black/45 xl:pt-0 xl:pb-0 xl:px-12",
            "max-[1024px]:landscape:inset-x-0 max-[1024px]:landscape:bottom-0 max-[1024px]:landscape:top-auto max-[1024px]:landscape:h-auto max-[1024px]:landscape:w-screen max-[1024px]:landscape:items-center max-[1024px]:landscape:justify-end max-[1024px]:landscape:text-center max-[1024px]:landscape:pt-24 max-[1024px]:landscape:pb-12"
          )}
        >
          <Header
            subHeader="The Bride"
            title="Devi Yuliana Nurhaliza"
            subTitle="Putri Pertama dari Bapak Deden Herman K dan Ibu Selvia A. D"
            className="text-white py-10"
            classNameTitle="text-[#f2dfa0] dark:text-primary text-5xl w-full"
            classNameSubTitle="text-md md:text-xl opacity-75"
            spaceY={3}
            separator={
              <span className="h-px w-16 bg-linear-to-r from-transparent via-[#d4af37] to-transparent xl:bg-linear-to-l xl:from-[#d4af37] xl:via-transparent xl:to-transparent xl:w-24 dark:via-primary xl:dark:from-primary" />
            }
          />
        </div>
      </div>
    )
  }
)

BioSequence.displayName = "BioSequence"
export default BioSequence
