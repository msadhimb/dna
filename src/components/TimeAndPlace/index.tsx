"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useGuest } from "@/store/useGuest"
import { useImageUrl } from "@/store/useImageUrl"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent } from "@/components/Tabs"
import Header from "../Header"

gsap.registerPlugin(ScrollTrigger)

const INFO = {
  mantu: {
    label: "Hari Pernikahan",
    date: "12 Desember 2026",
    hours: "09.00 — 15.00 WIB",
    place: "Gedung DPD KNPI Tangerang",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.645103116751!2d106.6326327!3d-6.178238399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8d465b9f9c5%3A0x880e353b4abebf2f!2sDPD%20KNPI%20Tangerang!5e0!3m2!1sen!2sid!4v1786944064704!5m2!1sen!2sid",
    mapTitle: "Peta Gedung DPD KNPI Tangerang",
  },
  unduh: {
    label: "Hari Unduh Mantu",
    date: "26 Desember 2026",
    hours: "11.00 — 13.00 WIB",
    place: "Hotel Laras Asri Resort & Spa",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.114132730096!2d110.50774771193014!3d-7.341078292636948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a79d27a7fa11d%3A0x233a2a304f948f!2sHotel%20Laras%20Asri%20Resort%20and%20Spa!5e0!3m2!1sid!2sid!4v1788679413970!5m2!1sid!2sid",
    mapTitle: "Peta Hotel Laras Asri Resort & Spa",
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
    ? (imageUrl?.dark?.[2]?.link ?? imageUrl?.dark?.[1]?.link)
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
      id="time-and-place"
      ref={sectionRef}
      className="relative w-full scroll-mt-16 overflow-hidden bg-background min-h-screen"
    >
      {/* foto background */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src={bgPhoto}
          alt=""
          fill
          sizes="100vw"
          loading="lazy"
          className="object-cover object-[50%_50%] dark:object-[40%_10%]"
          quality={80}
          unoptimized
        />
      </div>
      {/* overlay baca: gelap merata + blend ke section atas/bawah */}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center gap-5 px-0 py-24 md:py-32 sm:px-6 md:gap-10 md:px-10">
        {/* header */}

        <Header
          subHeader="Hari Bahagia Kami"
          title="Waktu & Tempat"
          subTitle="Catat tanggalnya, datang ke lokasinya — kehadiran dan doa restu Anda sangat berarti bagi kami."
          className="text-white"
        />

        {/* tabs — hanya tampil bila tamu diundang ke dua acara */}
        {showBoth ? (
          <Tabs
            mode="glass"
            value={activeKey}
            onValueChange={(v) => setActiveTab(v as "mantu" | "unduh")}
            items={[
              { value: "mantu", label: "Pernikahan" },
              { value: "unduh", label: "Unduh Mantu" },
            ]}
            listLabel="Pilih acara"
            listClassName="tp-tabs"
            className="mx-auto w-full px-5"
            triggerClassName="h-auto flex-none rounded-full border-0 px-3 py-2 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 data-[state=active]:bg-wedding-accent data-[state=active]:text-white data-[state=active]:shadow-md md:px-3"
          >
            {(["mantu", "unduh"] as const).map((key) => {
              const item = INFO[key]
              return (
                <TabsContent
                  key={key}
                  value={key}
                  className="w-full data-[state=inactive]:hidden"
                >
                  <div className="flex w-full flex-col gap-5">
                    {/* kartu tanggal — liquid glass */}
                    <div
                      className={cn(
                        "tp-card relative overflow-hidden rounded-[20px] border px-5 py-6 text-center md:px-8",
                        onPhoto
                          ? "border-white/15 bg-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                          : "border-wedding-border-accent bg-wedding-surface shadow-wedding-card"
                      )}
                    >
                      <Header
                        subHeader={item.label}
                        title={item.date}
                        subTitle={item.hours}
                        classNameSubTitle="font-serif text-lg leading-relaxed md:text-[15px]"
                        className={onPhoto ? "text-white" : ""}
                        classNameTitle="font-serif text-2xl leading-[1.2] font-semibold text-balance md:text-[28px]"
                      />
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
                      <Header
                        subHeader="Lokasi"
                        title={item.place}
                        subTitle={""}
                        classNameSubTitle="font-serif text-lg leading-relaxed md:text-[15px]"
                        className={onPhoto ? "text-white" : ""}
                        classNameTitle="font-serif text-2xl leading-[1.2] font-semibold text-balance md:text-[28px]"
                      />

                      <div
                        className={cn(
                          "mt-5 h-[220px] overflow-hidden rounded-2xl border md:h-[260px]",
                          onPhoto
                            ? "border-white/15"
                            : "border-wedding-border-accent"
                        )}
                      >
                        <iframe
                          src={item.mapSrc}
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
                          title={item.mapTitle}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        ) : (
          <div className="flex w-full flex-col gap-5 px-5 ">
            {/* kartu tanggal — liquid glass */}
            <div
              className={cn(
                "tp-card relative overflow-hidden rounded-[20px] border px-5 py-6 text-center md:px-8",
                onPhoto
                  ? "border-white/15 bg-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                  : "border-wedding-border-accent bg-wedding-surface shadow-wedding-card"
              )}
            >
              <Header
                subHeader={info.label}
                title={info.date}
                subTitle={info.hours}
                classNameSubTitle="font-serif text-sm leading-relaxed md:text-[15px]"
                className={onPhoto ? "text-white" : ""}
                classNameTitle="font-serif text-2xl leading-[1.2] font-semibold text-balance md:text-[28px]"
              />
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
              <Header
                subHeader="Lokasi"
                title={info.place}
                subTitle={info.date + " · " + info.hours}
                classNameSubTitle="font-serif text-sm leading-relaxed md:text-[15px]"
                className={onPhoto ? "text-white" : ""}
                classNameTitle="font-serif text-2xl leading-[1.2] font-semibold text-balance md:text-[28px]"
              />

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
        )}
      </div>
    </section>
  )
}

export default TimeAndPlace
