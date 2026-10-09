"use client"

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react"
import Image from "next/image"
import { gsap } from "@/lib/gsap"
import { useImageUrl } from "@/store/useImageUrl"
import { Card } from "@/components/Card"
import { Separator } from "../ui/separator"
import Header from "../Header"
import { ArrowDown, ArrowDownZa, ChevronDown } from "lucide-react"
import ScrollIndicator from "../ScrollIndicator"

export interface LoveJourneyHorizontalRef {
  getTimeline: () => gsap.core.Timeline

  getSnapPoints?: () => number[]
}

interface Props {
  theme: string
}

const LoveJourneyHorizontal = forwardRef<LoveJourneyHorizontalRef, Props>(
  ({ theme }, ref) => {
    const rootRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const { imageUrl } = useImageUrl() as any

    useEffect(() => {
      const track = trackRef.current
      if (!track) return
      const cards = track.querySelectorAll<HTMLElement>(".ljh-card")
      if (!cards.length) return
      const vw = window.innerWidth
      const c0 = cards[0]
      const centerX = c0.offsetLeft + c0.offsetWidth / 2 - vw / 2
      gsap.set(track, { x: -centerX })
      gsap.set(cards, { opacity: 0.45, scale: 0.92, y: 8, rotation: 0 })
      gsap.set(cards[0], { opacity: 1, scale: 1, y: 0 })
    }, [theme, imageUrl])

    const photos = [
      theme === "dark" ? imageUrl?.dark?.[2]?.link : imageUrl?.light?.[1]?.link,
      theme === "dark" ? imageUrl?.dark?.[5]?.link : imageUrl?.light?.[2]?.link,
      theme === "dark" ? imageUrl?.dark?.[4]?.link : imageUrl?.light?.[4]?.link,
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
          const hint = root.querySelector<HTMLElement>(".ljh-hint")

          const getCenterX = (idx: number) => {
            const vw = window.innerWidth
            const c = cards[idx] as HTMLElement | undefined
            if (!c) return 0

            const center = c.offsetLeft + c.offsetWidth / 2 - vw / 2
            return center
          }

          const DWELL0 = 0.4
          const MOVE = 1.2
          const DWELL1 = 0.4

          const TAIL = 0.8

          tl.set(track, { x: () => -getCenterX(0) }, 0)
          tl.set(
            cards,
            { opacity: 0.45, scale: 0.92, y: 8, rotation: 0, force3D: true },
            0
          )
          tl.set(cards[0], { opacity: 1, scale: 1, y: 0 }, 0)
          tl.set(hint, { opacity: 0 }, 0)

          tl.to(hint, { opacity: 1, duration: 0.3, ease: "none" }, 0)

          tl.to({}, { duration: DWELL0 }, 0)
          tl.addLabel("c0", DWELL0 / 2)

          const s1 = DWELL0
          tl.to(
            track,
            {
              x: () => -getCenterX(1),
              duration: MOVE,
              ease: "power2.inOut",
              force3D: true,
            },
            s1
          )
            .to(
              cards[0],
              {
                opacity: 0.45,
                scale: 0.92,
                y: 8,
                duration: 0.5,
                ease: "power1.inOut",
              },
              s1
            )
            .to(
              cards[1],
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
              },
              s1 + 0.2
            )

          tl.to({}, { duration: DWELL1 }, s1 + MOVE)
          tl.addLabel("c1", s1 + MOVE + DWELL1 / 2)

          const s2 = s1 + MOVE + DWELL1
          tl.to(
            track,
            {
              x: () => -getCenterX(2),
              duration: MOVE,
              ease: "power2.inOut",
              force3D: true,
            },
            s2
          )
            .to(
              cards[1],
              {
                opacity: 0.45,
                scale: 0.92,
                y: 8,
                duration: 0.5,
                ease: "power1.inOut",
              },
              s2
            )
            .to(
              cards[2],
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
              },
              s2 + 0.2
            )

          tl.to({}, { duration: TAIL }, s2 + MOVE)
          tl.addLabel("c2", s2 + MOVE + TAIL / 2)

          return tl
        },
      }),
      [theme, imageUrl]
    )

    const items = [
      {
        year: "2018",
        title: "Awal Bertemu",
        note: "sebuah pandangan sederhana yang diam-diam menjadi awal dari cerita panjang",
        text: "2018 — sebuah pertemuan pertama, tanpa sapaan dan tanpa keberanian untuk saling mengenal. Hanya sebuah pandangan singkat yang tersimpan sebagai bagian kecil dari perjalanan yang belum diketahui arahnya.",
      },
      {
        year: "2024",
        title: "Mulai Mendekati",
        note: "enam tahun berlalu, hingga sebuah keberanian membuka jalan menuju kisah yang berbeda",
        text: "2024 — perkenalan akhirnya dimulai dengan niat untuk saling mengenal lebih dekat. Dari percakapan sederhana, tumbuh rasa, kedekatan, dan sebuah hubungan yang perlahan menemukan arah.",
      },
      {
        year: "2026",
        title: "Menuju Pernikahan",
        note: "pertemuan yang bermula dari kejauhan, kini sampai pada sebuah janji untuk selamanya",
        text: "2026 — perjalanan dari sebuah pandangan, berlanjut menjadi sebuah kedekatan, hingga akhirnya membawa dua insan pada keputusan untuk membangun kehidupan bersama. Sebuah cerita yang menemukan rumahnya dalam ikatan pernikahan.",
        isBridging: true,
      },
    ]

    return (
      <div
        ref={rootRef}
        className="ljh-root relative flex h-full w-full flex-col justify-center overflow-hidden bg-background"
      >
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

        <Header
          subHeader="Our Love Story"
          title="Our Story"
          subTitle="Tiga babak kecil yang membawa kami sampai ke hari ini — dari sapa
            pertama hingga janji selamanya."
          className="ljh-header"
        />

        <div className="ljh-track-wrap relative z-10 py-5">
          <div
            ref={trackRef}
            className="flex items-stretch gap-5 pl-5 pr-5 md:gap-7 md:pl-10"
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
                  <div className="ljh-photo relative h-[24vh] max-h-[220px] min-h-[150px] w-full overflow-hidden md:h-auto md:max-h-none md:min-h-[320px] md:w-[46%] md:shrink-0">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={it.title}
                        fill
                        sizes="(max-width: 768px) 82vw, 260px"
                        quality={60}
                        className="object-cover"
                        priority={i === 0}
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-wedding-surface font-sans text-xs tracking-widest text-wedding-text-secondary uppercase">
                        foto {it.year}
                      </div>
                    )}

                    <span className="absolute top-3 left-3 z-20 rounded-full border border-white/20 bg-black/55 px-3 py-1 font-sans text-[10px] font-bold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                      {it.year}
                    </span>
                  </div>

                  <div className="ljh-body md:px-7 md:py-6 px-5 py-4 space-y-3 text-justify ">
                    <div className="flex flex-col items-center text-center md:items-start md:justify-center md:text-left">
                      <h3 className="font-serif text-[22px] leading-tight font-bold text-wedding-text-primary md:text-[26px]">
                        {it.title}
                      </h3>
                      <p className="font-serif text-[11px] tracking-wide text-wedding-text-secondary font-bold italic md:text-[12px]">
                        {it.note}
                      </p>
                    </div>
                    <Separator />
                    <p className="ljh-text font-serif text-[12px] leading-[1.65] text-wedding-text-secondary md:text-[13px] md:leading-[1.7]">
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
              scroll kebawah untuk menggeser cerita
            </span>
            <span className="md:hidden">geser kebawah pelan</span>
          </p>
          <p className="font-signature text-lg text-wedding-accent">
            2018 <span className="mx-1 opacity-40">—</span> 2024{" "}
            <span className="mx-1 opacity-40">—</span> selamanya
          </p>
          <ScrollIndicator />
        </div>
      </div>
    )
  }
)

LoveJourneyHorizontal.displayName = "LoveJourneyHorizontal"
export default LoveJourneyHorizontal
