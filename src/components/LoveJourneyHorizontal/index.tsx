"use client"

import { forwardRef, useRef, useImperativeHandle } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useImageUrl } from "@/store/useImageUrl"
import { Card } from "@/components/Card"
import { Separator } from "../ui/separator"
import Header from "../Header"

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
          gsap.set(hint, { opacity: 0 })

          // set card 0 sebagai active awal (akan di-animate di timeline)
          gsap.set(cards[0], { opacity: 1, scale: 1, y: 0 })
          gsap.set(labels[0], { opacity: 1 })

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
      },
      {
        year: "2024",
        title: "Pacaran",
        note: "enam tahun berputar, hati akhirnya menemukan arah",
        text: "2024 — setelah sekian lama berjalan berdampingan sebagai sahabat, kami memilih untuk saling menjaga sepenuh hati. Bukan karena terburu-buru, melainkan karena yakin: suka dan duka ingin kami lalui dengan genggaman yang sama.",
      },
      {
        year: "Kini",
        title: "Menuju Pernikahan",
        note: "dari dua cerita, kini menjadi satu rumah",
        text: "Hari ini, seluruh penantian, doa, dan kesabaran bertemu di satu jawaban yang indah. Kami tak berjanji hidup selalu mudah, namun kami berjanji menghadapinya bersama, selamanya. Mohon doa restu — 2018 · 2024 · selamanya.",
        isBridging: true,
      },
    ]

    return (
      <div
        ref={rootRef}
        className="relative flex h-full w-full flex-col justify-center overflow-hidden bg-background"
      >
        {/* backdrop — sama seperti RomanticQuote / EventDetails */}
        <div
          className="pointer-events-none absolute inset-0 bg-wedding-dot opacity-60"
          style={{
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 78%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 78%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 50% 38%, color-mix(in srgb, var(--wedding-accent) 10%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* header — pola SectionHeader terpusat */}
        <Header
          subHeader="Our Love Story"
          title="Our Story"
          subTitle="Tiga babak kecil yang membawa kami sampai ke hari ini — dari sapa
            pertama hingga janji selamanya."
          className="ljh-header"
        />

        <div className="relative z-10 mt-4 flex shrink-0 flex-wrap items-center justify-center gap-2 px-5 md:mt-5 md:px-10">
          {["2018 — bertemu", "2024 — pacaran", "kini — menikah"].map(
            (label, i) => (
              <span
                key={label}
                className="ljh-label flex items-center gap-2 rounded-full border border-wedding-border-accent bg-wedding-surface/80 px-2.5 py-1.5 font-sans text-[9px] font-semibold tracking-[0.18em] text-wedding-text-secondary uppercase backdrop-blur-sm md:px-3 md:text-[10px]"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-wedding-accent/15 font-serif text-[9px] font-bold text-wedding-accent">
                  {i + 1}
                </span>
                {label}
              </span>
            )
          )}
        </div>

        {/* track - carousel center mode */}
        <div className="relative z-10 py-5">
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 pl-5 pr-5 will-change-transform md:gap-7 md:pl-10"
            style={{ flexShrink: 0 }}
          >
            {items.map((it, i) => {
              const photo = photos[i]
              return (
                <Card
                  key={it.year + i}
                  className="ljh-card w-[82vw] max-w-[360px] shrink-0 overflow-hidden p-0 md:w-[560px] md:max-w-[560px] md:flex-row"
                  radius="20px"
                  style={{
                    transformOrigin: "center center",
                    scrollSnapAlign: "center",
                    scrollSnapStop: "always",
                  }}
                >
                  {/* foto */}
                  <div className="relative h-[24vh] max-h-[220px] min-h-[150px] w-full overflow-hidden md:h-auto md:max-h-none md:min-h-[320px] md:w-[46%] md:shrink-0">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={it.title}
                        fill
                        sizes="(max-width: 768px) 82vw, 260px"
                        className="object-cover"
                        priority={i === 0}
                        // File light 1-2,5MB: lewat optimizer Next saat cold
                        // antrean optimasi bisa timeout -> gambar broken.
                        // Direct URL sudah di-preload loading screen, jadi
                        // unoptimized justru lebih cepat + anti gagal.
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-wedding-surface font-sans text-xs tracking-widest text-wedding-text-secondary uppercase">
                        foto {it.year}
                      </div>
                    )}

                    {/* year pill */}
                    <span className="absolute top-3 left-3 z-20 rounded-full border border-white/20 bg-black/55 px-3 py-1 font-sans text-[10px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                      {it.year}
                    </span>
                  </div>

                  {/* body — teks di surface, bukan di atas gambar */}
                  <div className="md:px-7 md:py-6 px-5 py-4 space-y-3 text-justify ">
                    <div className="flex flex-col items-center text-center md:items-start md:justify-center md:text-left">
                      <h3 className="font-serif text-[22px] leading-tight font-bold text-wedding-text-primary md:text-[26px]">
                        {it.title}
                      </h3>
                      <p className="font-serif text-[11px] tracking-wide text-wedding-text-secondary font-bold italic md:text-[12px]">
                        {it.note}
                      </p>
                    </div>
                    <Separator />
                    <p className="font-serif text-[12px] leading-[1.65] text-wedding-text-secondary md:text-[13px] md:leading-[1.7]">
                      {it.text}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="ljh-hint relative z-10 flex shrink-0 flex-col items-center gap-1.5 px-5 pt-4 pb-4 md:px-10 md:pt-6 md:pb-6">
          <p className="font-sans text-[11px] tracking-[0.2em] text-wedding-text-secondary uppercase">
            <span className="hidden md:inline">
              scroll untuk menggeser cerita
            </span>
            <span className="md:hidden">geser pelan</span>
          </p>
          <p className="font-signature text-lg text-wedding-accent">
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
