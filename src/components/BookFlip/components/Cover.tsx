import { useImageUrl } from "@/store/useImageUrl"
import Image from "next/image"
import React from "react"

interface CoverProps {
  isDark: boolean
  gold: string
  ribbonRef: React.RefObject<any>
}

const Cover = ({ isDark, gold, ribbonRef }: CoverProps) => {
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
      <div className="relative z-10 mt-3 flex flex-col items-center gap-[2px]">
        <span
          className="font-serif text-[2rem] font-bold text-white"
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
              width={200}
              height={200}
            />
          )}
        </div>
      </div>
      {/* bottom block */}
      <div className="relative z-10 mb-2 flex flex-col items-center gap-[2px]">
        <span
          className="font-serif text-[1.8rem] font-bold text-white"
          style={{
            textShadow: "0 1px 1px rgba(0,0,0,0.5)",
          }}
        >
          DEPARTEMEN AGAMA
        </span>
        <span
          className="font-serif text-[1.8rem] font-bold text-white"
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
        className="absolute bottom-[10px] flex items-end gap-[6px]"
      />
    </>
  )
}

export default Cover
