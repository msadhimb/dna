import { useImageUrl } from "@/store/useImageUrl"
import Image from "next/image"
import React from "react"

interface CoverDefaultProps {
  isDark: boolean
  gold: string
  ribbonRef: React.RefObject<any>
}

const CoverDefault = ({ isDark, gold, ribbonRef }: CoverDefaultProps) => {
  const { imageUrl } = useImageUrl()

  // Cari item dengan nama "garuda.png" di list icon, bukan asal ambil index [0]
  const garudaIcon = (imageUrl as any)?.icon?.find((item: any) =>
    item?.name?.toLowerCase().includes("garuda")
  )

  return (
    <>
      {" "}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, rgba(0,0,0,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* title block */}
      <div className="relative z-10 mt-2 sm:mt-3 flex flex-col items-center gap-0.5">
        <span
          className="font-serif font-bold text-yellow-400 text-[clamp(1.15rem,6vw,2rem)] sm:text-[2rem] max-[390px]:text-[clamp(1.1rem,5vw,1.5rem)]"
          style={{
            textShadow: "0 1px 1px rgba(0,0,0,0.5)",
          }}
        >
          BUKU NIKAH {isDark ? "SUAMI" : "ISTRI"}
        </span>
      </div>
      {/* emblem */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div
          style={{
            filter: "sepia(1) saturate(3) hue-rotate(5deg) brightness(1.05)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {garudaIcon?.link && (
            <Image
              src={garudaIcon.link}
              alt="Emblem"
              width={300}
              height={300}
              className="h-auto w-[clamp(170px,44vw,260px)] max-[390px]:w-[clamp(160px,46vw,220px)] object-contain"
              sizes="(max-width: 390px) 46vw, 260px"
              priority
            />
          )}
        </div>
      </div>
      {/* bottom block */}
      <div className="relative z-10 mb-1 sm:mb-2 flex flex-col items-center gap-0 sm:gap-0.5">
        <span
          className="font-serif font-bold text-yellow-400 text-[clamp(1rem,5.5vw,1.8rem)] sm:text-[1.8rem] max-[390px]:text-[clamp(0.95rem,4.5vw,1.35rem)]"
          style={{
            textShadow: "0 1px 1px rgba(0,0,0,0.5)",
          }}
        >
          DEPARTEMEN AGAMA
        </span>
        <span
          className="font-serif font-bold text-yellow-400 text-[clamp(1rem,5.5vw,1.8rem)] sm:text-[1.8rem] max-[390px]:text-[clamp(0.95rem,4.5vw,1.35rem)]"
          style={{
            textShadow: "0 1px 1px rgba(0,0,0,0.5)",
          }}
        >
          REPUBLIK INDONESIA
        </span>
      </div>
      {/* ribbon */}
      <div
        ref={ribbonRef}
        className="absolute bottom-2.5 flex items-end gap-1.5"
      />
    </>
  )
}

export default CoverDefault
