"use client"

import { forwardRef, useRef, useImperativeHandle } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useImageUrl } from "@/store/useImageUrl"

export interface LoveJourneyHorizontalRef {
  getTimeline: () => gsap.core.Timeline
  /** global snap points 0-1 untuk master ScrollTrigger */
  getSnapPoints?: () => number[]
}

interface Props {
  theme: string
}

/**
 * Magnet scroll per gambar + tepat di tengah (carousel)
 * - Tiap card snap di tengah viewport (peek kiri/kanan)
 * - Menggunakan vertical scroll (scrub) yang di-snap via master ScrollTrigger
 * - Track x dihitung dari offsetLeft + width/2 - vw/2 agar presisi center
 */
const LoveJourneyHorizontal = forwardRef<LoveJourneyHorizontalRef, Props>(
  ({ theme }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const { imageUrl } = useImageUrl() as any

    const photos = [
      theme === "dark" ? imageUrl?.dark?.[2]?.link : imageUrl?.light?.[1]?.link,
      theme === "dark" ? imageUrl?.dark?.[5]?.link : imageUrl?.light?.[2]?.link,
      theme === "dark" ? imageUrl?.dark?.[4]?.link : imageUrl?.light?.[3]?.link,
    ]

    useImperativeHandle(
      ref,
      () => ({
        getTimeline: () => {
          const tl = gsap.timeline()
          const root = rootRef.current
          const track = trackRef.current
          if (!root || !track) return tl

          const cards = track.querySelectorAll<HTMLElement>(".ljh-card")
          const labels = root.querySelectorAll<HTMLElement>(".ljh-label")
          const header = root.querySelector<HTMLElement>(".ljh-header")
          const hint = root.querySelector<HTMLElement>(".ljh-hint")

          // helper: posisi x agar card[idx] tepat di tengah viewport
          const getCenterX = (idx: number) => {
            const vw = window.innerWidth
            const c = cards[idx] as HTMLElement | undefined
            if (!c) return 0
            // offsetLeft relatif ke track, offsetWidth = lebar card
            const center = c.offsetLeft + c.offsetWidth / 2 - vw / 2
            return center
          }

          // initial state
          gsap.set(track, { x: () => -getCenterX(0) })
          gsap.set(cards, { opacity: 0.45, scale: 0.92, y: 8, rotation: 0 })
          gsap.set(labels, { opacity: 0.35 })
          gsap.set(header, { opacity: 0, y: 12 })
          gsap.set(hint, { opacity: 0 })

          // set card 0 sebagai active awal (akan di-animate di timeline)
          gsap.set(cards[0], { opacity: 1, scale: 1, y: 0 })
          gsap.set(labels[0], { opacity: 1 })

          tl.to(
            header,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            0
          )
          tl.to(hint, { opacity: 1, duration: 0.3, ease: "none" }, 0.15)
          // hold sebentar di card 0 (magnet pertama)
          tl.to({}, { duration: 0.5 })

          // ---- magnet 0 -> 1 (card 1 ke tengah) ----
          tl.to(
            track,
            { x: () => -getCenterX(1), duration: 1.4, ease: "power2.inOut" },
            "s1"
          )
            .to(
              cards[0],
              {
                opacity: 0.45,
                scale: 0.92,
                duration: 0.5,
                ease: "power1.inOut",
              },
              "s1"
            )
            .to(
              cards[1],
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "s1+=0.2"
            )
            .to(labels[0], { opacity: 0.35, duration: 0.35 }, "s1")
            .to(labels[1], { opacity: 1, duration: 0.35 }, "s1+=0.25")

          tl.to({}, { duration: 0.6 })

          // ---- magnet 1 -> 2 (card 2 ke tengah) ----
          tl.to(
            track,
            { x: () => -getCenterX(2), duration: 1.4, ease: "power2.inOut" },
            "s2"
          )
            .to(
              cards[1],
              {
                opacity: 0.45,
                scale: 0.92,
                duration: 0.5,
                ease: "power1.inOut",
              },
              "s2"
            )
            .to(
              cards[2],
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "s2+=0.2"
            )
            .to(labels[1], { opacity: 0.35, duration: 0.35 }, "s2")
            .to(labels[2], { opacity: 1, duration: 0.35 }, "s2+=0.25")

          tl.to({}, { duration: 0.8 })

          return tl
        },
      }),
      [theme, imageUrl]
    )

    const items = [
      {
        year: "2018",
        title: "Awal Bertemu",
        note: "dua asing yang belum tahu, semesta sedang menyiapkan sesuatu",
        text: "2018 — sebuah sapa sederhana yang tak pernah kami rencanakan. Tak ada janji, hanya percakapan hangat yang diam-diam menetap di hati. Dari sanalah kami belajar bahwa bersamamu, segalanya terasa pulang.",
        rot: "-1.2deg",
      },
      {
        year: "2024",
        title: "Pacaran",
        note: "enam tahun berputar, hati akhirnya menemukan arah",
        text: "2024 — setelah sekian lama berjalan berdampingan sebagai sahabat, kami memilih untuk saling menjaga sepenuh hati. Bukan karena terburu-buru, melainkan karena yakin: suka dan duka ingin kami lalui dengan genggaman yang sama.",
        rot: "0.9deg",
      },
      {
        year: "—",
        title: "Menuju Pernikahan",
        note: "dari dua cerita, kini menjadi satu rumah",
        text: "Hari ini, seluruh penantian, doa, dan kesabaran bertemu di satu jawaban yang indah. Kami tak berjanji hidup selalu mudah, namun kami berjanji menghadapinya bersama, selamanya. Mohon doa restu — 2018 · 2024 · selamanya.",
        rot: "-0.6deg",
        isBridging: true,
      },
    ]

    return (
      <div
        ref={rootRef}
        className="relative flex w-full flex-col gap-5 overflow-hidden"
      >
        {/* header */}
        <div className="ljh-header relative z-10 px-5 pt-6 md:px-10 md:pt-8">
          <h2 className="mt-1 font-serif text-[28px] leading-none tracking-[-0.02em] text-[#1e1a14] md:text-[34px] dark:text-[#e8ddd0]">
            Our Story
          </h2>
        </div>

        <div className="relative z-10 mt-4 flex gap-6 px-5 font-sans text-[11px] tracking-[0.18em] text-[#b8a07a] uppercase md:px-10 dark:text-[#6e5a4a]">
          <span className="ljh-label">2018 — bertemu</span>
          <span className="ljh-label">2024 — pacaran</span>
          <span className="ljh-label">kini — menikah</span>
        </div>

        {/* track - carousel center mode */}
        <div className="relative z-10 flex flex-1 items-center overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-5 pl-5 pr-5 will-change-transform md:gap-7 md:pl-10"
            style={{ flexShrink: 0 }}
          >
            {items.map((it, i) => {
              const photo = photos[i]
              return (
                <article
                  key={it.year + i}
                  className="ljh-card flex w-[82vw] max-w-[360px] shrink-0 flex-col bg-white md:w-[380px] dark:bg-[#141010]"
                  style={{
                    transform: `rotate(${it.rot})`,
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
                    // anchor untuk scale center snap
                    transformOrigin: "center center",
                    scrollSnapAlign: "center",
                    scrollSnapStop: "always",
                  }}
                >
                  {/* foto + TULISAN DI ATAS GAMBAR */}
                  <div className="relative h-[62vh] max-h-[460px] w-full overflow-hidden bg-[#f0e8d8] md:h-[420px] dark:bg-[#1e1512]">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={it.title}
                        fill
                        sizes="500vw"
                        className="object-cover"
                        priority={i === 0}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-sans text-xs tracking-widest text-[#9a865a] uppercase">
                        foto {it.year}
                      </div>
                    )}

                    {/* cap tahun */}
                    <span className="absolute top-3 left-3 z-20 bg-[#1e1a14] px-2 py-1 font-sans text-[10px] font-bold tracking-widest text-white dark:bg-white dark:text-black">
                      {it.year}
                    </span>

                    {/* gradient overlay biar teks kebaca */}
                    <div className="absolute inset-0 bg-linear-to-t from-muted/70 via-muted/30 to-transparent dark:from-black/85 dark:via-black/30" />

                    {/* TEKS DI ATAS GAMBAR */}
                    <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-1.5 p-4">
                      <h3 className="font-serif text-[19px] leading-tight font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                        {it.title}
                      </h3>
                      <p className="font-sans text-[11px] italic tracking-wide text-white/75">
                        {it.note}
                      </p>
                      <div className="my-1 h-px w-8 bg-white/30" />
                      <p className="font-serif text-[13px] leading-[1.6] text-white/90">
                        {it.text}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <div className="ljh-hint relative z-10 flex items-center justify-between px-5 pb-5 md:px-10 md:pb-6">
          <p className="font-sans text-[11px] tracking-wide text-[#9a8a6e] dark:text-[#6e5f51]">
            <span className="hidden md:inline">
              scroll buat geser cerita →{" "}
            </span>
            <span className="md:hidden">geser pelan →</span>
          </p>
          <p className="font-serif text-xs italic text-[#b8a07a] dark:text-[#7a6a5a]">
            2018 <span className="mx-1 opacity-40">—</span> 2024{" "}
            <span className="mx-1 opacity-40">—</span> selamanya
          </p>
        </div>
      </div>
    )
  }
)

LoveJourneyHorizontal.displayName = "LoveJourneyHorizontal"
export default LoveJourneyHorizontal
