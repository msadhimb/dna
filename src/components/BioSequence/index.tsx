"use client"

import Image from "next/image"
import { useRef, useImperativeHandle, forwardRef } from "react"
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
    // Satu sumber kebenaran: prop `theme` saja.
    // Sebelumnya isDark dari resolvedTheme vs `theme` prop bisa tidak sinkron
    // saat ganti tema -> x/y awal lompat (path patah).
    const isDark = theme === "dark"

    useImperativeHandle(
      ref,
      () => ({
        getTimeline: () => {
          const tl = gsap.timeline()
          const journeyImgElement =
            journeyImageRef.current?.querySelector(".journey-inner-img")

          if (!journeyImageRef.current || !journeyImgElement) {
            return tl
          }

          tl.set(
            [groomBioRef.current, brideBioRef.current],
            { autoAlpha: 0 },
            0
          )
          // set() tidak pakai duration/ease; force3D hanya untuk image, bukan overlay teks
          gsap.set(journeyImageRef.current, {
            width: dist("200vw", "100vw"),
            height: "100vh",
            borderRadius: "0px",
            clipPath: "none",
            x: isDark ? 0 : dist("-25vw", "0"),
            y: 0,
          })

          tl.to(
            journeyImageRef.current,
            {
              y: 0,
              borderRadius: "0px",
              duration: 1,
              ease: "none",
            },
            "gone"
          )

          // zoom into groom image and show groom bio
          // Overlay teks hanya animasi autoAlpha (visibility+opacity) + force3D:false
          // agar tidak bikin compositor layer raksasa bareng image scale=2 (penyebab lag).
          tl.to(
            journeyImgElement,
            {
              scale: isMobile ? 1.6 : 2,
              x:
                theme === "dark"
                  ? dist("-35vw", "-35vw")
                  : dist("-55vw", "-50vw"),
              y:
                theme === "dark" ? dist("-15vh", "20vh") : dist("20vh", "50vh"),
              duration: 1.5,
              ease: "none",
              force3D: true,
            },
            "zoomGroom"
          ).to(
            groomBioRef.current,
            {
              autoAlpha: 1,
              duration: 1,
              ease: "none",
              force3D: false,
            },
            "zoomGroom+=0.5"
          )

          tl.to(
            groomBioRef.current,
            {
              autoAlpha: 0,
              duration: 0.8,
              ease: "none",
              force3D: false,
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
              force3D: true,
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
              force3D: true,
            },
            "zoomBride"
          ).to(
            brideBioRef.current,
            {
              autoAlpha: 1,
              duration: 1,
              ease: "none",
              force3D: false,
            },
            "zoomBride+=0.5"
          )

          tl.to({}, { duration: 1 })

          tl.to(brideBioRef.current, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "none",
            force3D: false,
          }).to(journeyImgElement, {
            x: "0vw",
            y: "0vh",
            scale: 1,
            duration: 1.5,
            ease: "none",
            force3D: true,
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
          ref={journeyImageRef}
          className="gsap-element relative z-0 h-[42vh] w-[85vw] overflow-hidden rounded-2xl md:h-[40vh] md:w-[40vw] md:rounded-3xl"
          style={{
            borderRadius: "24px",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
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
            // 500vw/150vw memaksa browser + optimizer meminta gambar 5x viewport.
            // Ukuran real: 85vw mobile / 40vw desktop (zoom via transform, bukan file).
            sizes="(max-width: 768px) 85vw, 40vw"
            quality={75}
            priority
            fetchPriority="high"
            // File light ~2,3MB: optimizer cold bisa timeout saat refresh.
            // Direct URL sudah di-preload loading screen.
            unoptimized
            className="journey-inner-img object-cover"
          />
        </div>

        {/* Groom Bio Overlay - bottom on mobile/tablet/landscape, side only on xl */}
        <div
          ref={groomBioRef}
          className={cn(
            // invisible + pointer-events-none: tidak di-paint / hit-test saat autoAlpha=0.
            // Tanpa ini 2 gradient fullscreen tetap di-composite tiap frame scrub -> lag.
            "gsap-element pointer-events-none invisible absolute inset-x-0 bottom-0 z-50 flex w-screen flex-col gap-3 opacity-0",
            "items-center justify-end text-center bg-linear-to-t from-black/90 via-black/60 to-transparent pt-24 pb-12 px-6",
            "xl:inset-y-0 xl:bottom-auto xl:right-0 xl:left-auto xl:h-full xl:w-1/2 xl:items-end xl:justify-center xl:text-right xl:bg-linear-to-l xl:from-black/85 xl:via-black/45 xl:pt-0 xl:pb-0 xl:px-12",
            // landscape tablet/phone dengan tinggi kecil tetap bottom
            "max-[1024px]:landscape:inset-x-0 max-[1024px]:landscape:bottom-0 max-[1024px]:landscape:top-auto max-[1024px]:landscape:h-auto max-[1024px]:landscape:w-screen max-[1024px]:landscape:items-center max-[1024px]:landscape:justify-end max-[1024px]:landscape:text-center max-[1024px]:landscape:pt-24 max-[1024px]:landscape:pb-12"
          )}
        >
          <Header
            subHeader="The Groom"
            title="Muhamad Salman Adhim Baqy"
            subTitle="Putra Ketiga dari Bapak Suprapto Wibowo dan Ibu Christiana Sri Budhi H"
            // JANGAN pakai will-change-transform di teks yang hanya fade:
            // bikin layer GPU ekstra sebesar overlay, rebutan memori dengan image scale=2.
            className="text-white py-10"
            classNameTitle="text-[#f2dfa0] dark:text-primary text-5xl w-full"
            classNameSubTitle="text-md opacity-75"
            spaceY={3}
            separator={
              <span className="h-px w-16 bg-linear-to-r from-transparent via-[#d4af37] to-transparent xl:bg-linear-to-l xl:from-[#d4af37] xl:via-transparent xl:to-transparent xl:w-24 dark:via-primary xl:dark:from-primary" />
            }
          />
        </div>

        {/* Bride Bio Overlay - bottom on mobile/tablet/landscape, side only on xl */}
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
            classNameSubTitle="text-md opacity-75"
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
