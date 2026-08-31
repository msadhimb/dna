import React from "react"
import CoverDefault from "./components/CoverDefault"
import { cn } from "@/lib/utils"
import CoverBack from "./components/CoverBack"

const Cover = ({
  coverFront,
  coverBack,
  coverRef,
  coverFrontShadowRef,
  coverBackShadowRef,
  isDesktop,
  resolvedPages,
  gold,
  ribbonRef,
  isDark,
  coverGradient,
  isSpinning,
}: {
  coverFront: any
  coverBack: any
  coverRef: React.RefObject<HTMLDivElement | null>
  coverFrontShadowRef: React.RefObject<HTMLDivElement | null>
  coverBackShadowRef: React.RefObject<HTMLDivElement | null>
  isDesktop: boolean
  resolvedPages: React.ReactNode[]
  gold: string
  ribbonRef: React.RefObject<any>
  isDark: boolean
  coverGradient: string
  isSpinning: boolean
}) => {
  return (
    <>
      <div
        ref={coverRef}
        className="absolute inset-0"
        style={{
          zIndex: 100,
          transformStyle: "preserve-3d",
          pointerEvents: "none",
        }}
      >
        {/* Front of cover */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-[4px_8px_8px_4px] border-2 px-5 py-6 sm:px-7 sm:py-8 max-[390px]:px-4 max-[390px]:py-5 text-center border-border",
            coverFront?.className
          )}
          style={{
            transform: "translateZ(1px)",
            background: coverGradient,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)",
            pointerEvents: "auto", // re-enable untuk front face
            ...coverFront?.style,
          }}
        >
          {coverFront?.content ?? (
            <CoverDefault isDark={isDark} gold={gold} ribbonRef={ribbonRef} />
          )}

          <div
            ref={coverFrontShadowRef}
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
          />
        </div>

        {/* Back of cover (inside cover) */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 overflow-hidden rounded-[8px_4px_4px_8px] border bg-[#fdf8f0] px-5 py-6 sm:px-7 sm:py-9 max-[390px]:px-4 max-[390px]:py-5 text-center dark:bg-[#141414]",
            coverBack?.className
          )}
          style={{
            transform: "rotateY(180deg) translateZ(1px)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderColor: `${gold}30`,
            pointerEvents: "auto",
            ...coverBack?.style,
          }}
        >
          {isSpinning && <CoverBack background={coverGradient} />}
          {isDesktop && !isSpinning && (
            <div className="absolute inset-0 flex">
              {/* kiri = index 0 */}
              <div className="w-full flex flex-col items-center justify-center ...">
                {resolvedPages[0]}
              </div>
            </div>
          )}
          <div
            ref={coverBackShadowRef}
            className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/10 to-black/60"
          />
        </div>
      </div>
    </>
  )
}

export default Cover
