"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { CalendarHeart, Clock, MapPin } from "lucide-react"
import { OrnamentalDivider } from "@/components/Icons"
import { useGuest } from "@/store/useGuest"
import { useImageUrl } from "@/store/useImageUrl"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------------ */
/*  Data — ubah di sini kalau tanggal / lokasi berubah                  */
/* ------------------------------------------------------------------ */

const INFO = {
  mantu: {
    label: "Hari Pernikahan",
    date: "12 Desember 2026",
    hours: "09.00 — 15.00 WIB",
    place: "Hotel Laras Asri Resort & Spa",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.114132730096!2d110.50774771193014!3d-7.341078292636948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a79d27a7fa11d%3A0x233a2a304f948f!2sHotel%20Laras%20Asri%20Resort%20and%20Spa!5e0!3m2!1sid!2sid!4v1788679413970!5m2!1sid!2sid",
    mapTitle: "Peta Hotel Laras Asri Resort & Spa",
  },
  unduh: {
    label: "Hari Unduh Mantu",
    date: "26 Desember 2026",
    hours: "11.00 — 13.00 WIB",
    place: "Gedung DPD KNPI Tangerang",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.645103116751!2d106.6326327!3d-6.178238399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8d465b9f9c5%3A0x880e353b4abebf2f!2sDPD%20KNPI%20Tangerang!5e0!3m2!1sen!2sid!4v1786944064704!5m2!1sen!2sid",
    mapTitle: "Peta Gedung DPD KNPI Tangerang",
  },
} as const

/* ------------------------------------------------------------------ */

export const TimeAndPlace = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { guest } = useGuest()
  const { resolvedTheme } = useTheme()
  const { imageUrl } = useImageUrl() as any

  const isDark = resolvedTheme === "dark"
  const bgPhoto = isDark
    ? (imageUrl?.dark?.[3]?.link ?? imageUrl?.dark?.[1]?.link)
    : (imageUrl?.light?.[4]?.link ?? imageUrl?.light?.[1]?.link)
  const onPhoto = Boolean(bgPhoto)

  const showBoth = Boolean(guest?.mantu_status && guest?.unduh_mantu_status)
  const singleKey = guest?.mantu_status ? "mantu" : "unduh"
  const [activeTab, setActiveTab] = useState<"mantu" | "unduh">("mantu")

  const activeKey = showBoth ? activeTab : singleKey
  const info = INFO[activeKey]
  const mapFilter = isDark
    ? "invert(0.9) hue-rotate(180deg) saturate(0.7) brightness(0.85)"
    : "none"

  useGSAP(
    () => {
      // Entrance: jalan sekali saat section masuk viewport.
      // Tidak depend on activeKey supaya ganti tab tidak me-replay semuanya.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        ".tp-eyebrow",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      )
        .fromTo(
          ".tp-title",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".tp-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          ".tp-tabs",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".tp-card",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .fromTo(
          ".tp-closing",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
    },
    { scope: sectionRef, dependencies: [onPhoto] }
  )

  // Ganti tab: hanya kartu di bawah tab yang dianimasikan ulang.
  const isFirstTabRender = useRef(true)
  useEffect(() => {
    if (isFirstTabRender.current) {
      isFirstTabRender.current = false
      return
    }
    if (!sectionRef.current) return
    const cards = sectionRef.current.querySelectorAll(".tp-card")
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power3.out",
        overwrite: true,
      }
    )
  }, [activeKey])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background"
    >
      {onPhoto ? (
        <>
          {/* foto background */}
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={bgPhoto}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              quality={80}
            />
          </div>
          {/* overlay baca: gelap merata + blend ke section atas/bawah */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 36% 26% at 50% 30%, color-mix(in srgb, var(--wedding-accent) 16%, transparent) 0%, transparent 70%)",
            }}
          />
        </>
      ) : (
        /* fallback saat foto belum termuat — sama seperti section lain */
        <div
          className="pointer-events-none absolute top-0 left-1/2 h-[80vw] max-h-[520px] w-[92vw] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-wedding-dot opacity-50"
            style={{
              maskImage: "radial-gradient(circle, black 60%, transparent 78%)",
              WebkitMaskImage:
                "radial-gradient(circle, black 60%, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--wedding-accent) 13%, transparent) 0%, transparent 70%)",
            }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-14 sm:px-6 md:gap-10 md:px-10 md:py-24">
        {/* header */}
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className={cn(
              "tp-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase",
              onPhoto ? "text-white/70" : "text-wedding-text-secondary"
            )}
          >
            Hari Bahagia Kami
          </p>
          <h2
            className={cn(
              "tp-title font-signature leading-none font-bold",
              onPhoto
                ? "text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]"
                : "text-wedding-text-primary"
            )}
            style={{ fontSize: "clamp(2.2rem, 10vw, 4.5rem)" }}
          >
            Waktu & Tempat
          </h2>
          <p
            className={cn(
              "tp-desc max-w-md font-serif text-sm leading-relaxed",
              onPhoto ? "text-white/75" : "text-wedding-text-secondary"
            )}
          >
            Catat tanggalnya, datang ke lokasinya — kehadiran dan doa restu Anda
            sangat berarti bagi kami.
          </p>
        </div>

        {/* tabs — hanya tampil bila tamu diundang ke dua acara */}
        {showBoth && (
          <div
            role="tablist"
            aria-label="Pilih acara"
            className={cn(
              "tp-tabs flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-full border p-1.5",
              onPhoto
                ? "border-white/15 bg-black/30 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                : "border-wedding-border-accent bg-wedding-surface shadow-wedding-card"
            )}
          >
            {(["mantu", "unduh"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                role="tab"
                aria-selected={activeTab === key}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200 md:px-5",
                  activeTab === key
                    ? "bg-wedding-accent text-white shadow-md"
                    : onPhoto
                      ? "bg-transparent text-white/70 hover:text-white"
                      : "bg-transparent text-wedding-text-secondary"
                )}
              >
                {key === "mantu" ? "Pernikahan" : "Unduh Mantu"}
              </button>
            ))}
          </div>
        )}

        <div key={activeKey} className="flex w-full flex-col gap-5">
          {/* kartu tanggal — liquid glass */}
          <div
            className={cn(
              "tp-card relative overflow-hidden rounded-[20px] border px-5 py-6 text-center md:px-8",
              onPhoto
                ? "border-white/15 bg-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                : "border-wedding-border-accent bg-wedding-surface shadow-wedding-card"
            )}
          >
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px"
              aria-hidden="true"
              style={{
                background: onPhoto
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
                  : "linear-gradient(90deg, transparent, var(--wedding-accent), transparent)",
              }}
            />
            <p
              className={cn(
                "font-sans text-[10px] font-semibold tracking-[0.4em] uppercase",
                onPhoto ? "text-white/70" : "text-wedding-text-secondary"
              )}
            >
              {info.label}
            </p>
            <p
              className={cn(
                "font-signature text-[clamp(1.6rem,7vw,2.6rem)] leading-tight font-bold text-balance break-words",
                onPhoto
                  ? "text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]"
                  : "text-wedding-text-primary"
              )}
            >
              {info.date}
            </p>
            <p
              className={cn(
                "mt-1 flex flex-wrap items-center justify-center gap-1.5 text-center font-sans text-xs",
                onPhoto ? "text-white/80" : "text-wedding-text-secondary"
              )}
            >
              <Clock
                className={cn(
                  "h-3.5 w-3.5",
                  onPhoto ? "text-white" : "text-wedding-accent"
                )}
              />
              {info.hours}
            </p>
          </div>

          {/* kartu lokasi + peta — liquid glass */}
          <div
            className={cn(
              "tp-card relative overflow-hidden rounded-[20px] border px-5 py-6 text-center md:px-8",
              onPhoto
                ? "border-white/15 bg-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                : "border-wedding-border-accent bg-wedding-surface shadow-wedding-card"
            )}
          >
            <div
              className="pointer-events-none absolute inset-x-8 top-0 h-px"
              aria-hidden="true"
              style={{
                background: onPhoto
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)"
                  : "linear-gradient(90deg, transparent, var(--wedding-accent), transparent)",
              }}
            />
            <p
              className={cn(
                "font-sans text-[10px] font-semibold tracking-[0.4em] uppercase",
                onPhoto ? "text-white/70" : "text-wedding-text-secondary"
              )}
            >
              Lokasi
            </p>
            <p
              className={cn(
                "font-signature text-[clamp(1.4rem,6vw,2.2rem)] leading-tight font-bold text-balance break-words",
                onPhoto
                  ? "text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.45)]"
                  : "text-wedding-text-primary"
              )}
            >
              {info.place}
            </p>
            <p
              className={cn(
                "mt-1 flex flex-wrap items-center justify-center gap-1.5 text-center font-sans text-xs",
                onPhoto ? "text-white/80" : "text-wedding-text-secondary"
              )}
            >
              <MapPin
                className={cn(
                  "h-3.5 w-3.5",
                  onPhoto ? "text-white" : "text-wedding-accent"
                )}
              />
              <span className="inline-flex flex-wrap items-center justify-center gap-1.5 text-center">
                <CalendarHeart className="h-3.5 w-3.5" />
                {info.date} · {info.hours}
              </span>
            </p>

            <div
              className={cn(
                "mt-5 h-[220px] overflow-hidden rounded-2xl border md:h-[260px]",
                onPhoto ? "border-white/15" : "border-wedding-border-accent"
              )}
            >
              <iframe
                src={info.mapSrc}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  display: "block",
                  filter: mapFilter,
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={info.mapTitle}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimeAndPlace
