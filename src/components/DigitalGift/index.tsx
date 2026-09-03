"use client"

import { useRef, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { CreditCard, QrCode } from "lucide-react"
import {
  WaxSeal,
  OrnamentalDivider,
  EnvelopeIllustration,
} from "@/components/Icons"
import BankAccountCard from "./components/BankAccountCard"
import QrisCard from "./components/QrisCard"
import { Card } from "@/components/Card"
import { useGuest } from "@/store/useGuest"
import { useImageUrl } from "@/store/useImageUrl"
import { cn } from "@/lib/utils"

gsap.registerPlugin(ScrollTrigger)

export const DigitalGift = () => {
  const { resolvedTheme } = useTheme()
  const { guest } = useGuest()
  const { imageUrl } = useImageUrl()

  const isDark = resolvedTheme === "dark"
  const sectionRef = useRef<HTMLElement>(null)
  const [activeTab, setActiveTab] = useState<"bank" | "qris">("bank")

  // Cari QRIS dari storage image-icon (qris.png / qris.jpg / qrcode)
  const qrisIcon = (imageUrl as any)?.icon?.find((item: any) =>
    item?.name?.toLowerCase().includes("qris") || item?.name?.toLowerCase().includes("qr")
  )
  const qrisUrl: string =
    qrisIcon?.link ??
    // fallback demo — ganti dengan file di supabase storage image-icon/qris.png
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QRIS-Devi-Adhim-Wedding-Gift"

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      tl.fromTo(
        ".dg-bridge",
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.6, ease: "power3.inOut", transformOrigin: "center" }
      )
        .fromTo(
          ".dg-eyebrow",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          ".dg-title-word",
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-desc",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-envelope",
          { opacity: 0, y: 24, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-ornament-1",
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
            transformOrigin: "center",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-message",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-tabs",
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" },
          "-=0.2"
        )
        .fromTo(
          ".dg-cards-wrapper",
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          "-=0.3"
        )
        .fromTo(
          ".dg-card",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.18,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .fromTo(
          ".dg-closing",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3"
        )
    },
    { scope: sectionRef }
  )

  // Animasi halus saat ganti tab
  useEffect(() => {
    if (!sectionRef.current) return
    gsap.fromTo(
      ".dg-cards-wrapper",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: true }
    )
  }, [activeTab])

  return (
    <section
      ref={sectionRef}
      className="dg-section relative w-full overflow-hidden bg-background"
    >
      {/* Lingkaran terpusat — hanya beberapa rem di luar content utama, tidak full background */}
      <div className="pointer-events-none absolute left-1/2 top-[48%] h-[92vw] max-h-[560px] w-[92vw] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[840px] md:max-h-[840px] md:w-[840px] md:max-w-[840px] lg:h-[1020px] lg:max-h-[1020px] lg:w-[1020px] lg:max-w-[1020px] overflow-hidden">
        <div
          className="absolute inset-0 bg-wedding-dot opacity-50"
          style={{
            maskImage: "radial-gradient(circle, black 60%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 78%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--wedding-accent) 13%, transparent) 0%, color-mix(in srgb, var(--wedding-accent) 5%, transparent) 40%, transparent 73%)",
          }}
        />
      </div>

      <div className="dg-content relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-10 md:gap-10 md:px-10">
        {/* ── Bridge dari CommentSection ── */}
        <div className="dg-bridge flex w-full max-w-xs items-center gap-3 opacity-60">
          <div className="h-px flex-1 bg-wedding-border-accent" />
          <div className="h-1 w-1 rotate-45 bg-wedding-accent opacity-50" />
          <div className="h-px flex-1 bg-wedding-border-accent" />
        </div>

        {/* ── Header — gaya SectionHeader agar nyambung ── */}
        <div className="dg-header flex flex-col items-center gap-6 text-center">
          <p className="dg-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase text-wedding-text-secondary">
            Amplop Digital
          </p>
          <h2
            className="dg-title-word font-signature font-bold leading-none text-wedding-text-primary"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
            }}
          >
            Wedding Gift
          </h2>
          <p className="dg-desc max-w-md font-sans text-sm leading-relaxed text-wedding-text-secondary">
            Doa restu Anda adalah hadiah terindah. Namun jika berkenan berbagi tanda kasih, amplop digital ini kami sediakan dengan penuh terima kasih.
          </p>
        </div>

        {/* ── Envelope Illustration ── */}
        <div className="dg-envelope">
          <EnvelopeIllustration isDark={isDark} accent="var(--wedding-accent)" />
        </div>

        {/* ── Ornamental Divider — konsisten dengan CommentSection ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider />
        </div>

        {/* ── Message Card — menggunakan Card terpusat ── */}
        <Card className="dg-message group w-full max-w-lg px-8 py-8 text-center md:px-12 md:py-10">
          {/* Wax seal overlapping top */}
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2"
            style={{ zIndex: 10 }}
          >
            <WaxSeal isDark={isDark} accent="var(--wedding-accent)" />
          </div>

          {/* Names */}
          <p
            className="font-signature font-bold text-wedding-text-primary"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              lineHeight: 1.2,
              paddingTop: "16px",
            }}
          >
            Devi &amp; Adhim
          </p>

          {/* Inner ornament */}
          <div className="mx-auto my-4 flex items-center gap-3">
            <div className="h-px flex-1 max-w-12 bg-wedding-border-accent" />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1 L7.5 4.5 L11 6 L7.5 7.5 L6 11 L4.5 7.5 L1 6 L4.5 4.5 Z"
                fill="var(--wedding-accent)"
                opacity="0.6"
              />
            </svg>
            <div className="h-px flex-1 max-w-12 bg-wedding-border-accent" />
          </div>

          {/* Message */}
          <p className="mx-auto max-w-sm font-sans text-sm font-light leading-relaxed text-wedding-text-secondary" style={{ lineHeight: 1.9 }}>
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah
            hati menerimanya.
          </p>
        </Card>

        {/* ── Ornamental Divider ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider />
        </div>

        {/* ── Tab Switcher — Bank / QRIS ── */}
        <div
          className="dg-tabs flex items-center gap-1.5 rounded-full p-1.5 bg-wedding-surface border border-wedding-border-accent shadow-wedding-card"
          role="tablist"
          aria-label="Metode hadiah"
        >
          <button
            onClick={() => setActiveTab("bank")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200",
              activeTab === "bank"
                ? "bg-wedding-accent text-white shadow-md"
                : "bg-transparent text-wedding-text-secondary"
            )}
            aria-selected={activeTab === "bank"}
            role="tab"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Bank Transfer
          </button>
          <button
            onClick={() => setActiveTab("qris")}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200",
              activeTab === "qris"
                ? "bg-wedding-accent text-white shadow-md"
                : "bg-transparent text-wedding-text-secondary"
            )}
            aria-selected={activeTab === "qris"}
            role="tab"
          >
            <QrCode className="h-3.5 w-3.5" />
            QRIS
          </button>
        </div>

        {/* ── Content: Bank Account Cards / QRIS ── */}
        {activeTab === "bank" ? (
          <div className="dg-cards-wrapper relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 md:w-auto md:flex-row md:gap-8">
            {guest?.guest_from === "devis_mother" ||
            guest?.guest_from === "devis_father" ||
            guest?.guest_from === "devis_family_neighbor" ? (
              <BankAccountCard
                svg={
                  "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
                }
                accountNumber="7130633280"
                accountName="Selvia Agustin"
              />
            ) : (
              <>
                <BankAccountCard
                  svg={
                    "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bni.svg"
                  }
                  accountNumber="1819801119"
                  accountName="Salman Adhim"
                />
                <BankAccountCard
                  svg={
                    "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
                  }
                  accountNumber="7296154554"
                  accountName="Devi Yuliana"
                />
              </>
            )}
          </div>
        ) : (
          <div className="dg-cards-wrapper relative z-10 flex w-full justify-center">
            <QrisCard qrisUrl={qrisUrl} qrisName="Devi & Adhim" />
          </div>
        )}

        {/* ── Closing ── */}
        <div className="dg-closing flex flex-col items-center gap-4 text-center">
          <OrnamentalDivider size="small" />

          <p className="max-w-md font-sans text-sm font-light leading-relaxed italic text-wedding-text-secondary" style={{ lineHeight: 2 }}>
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak,
            Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-wedding-border-accent" />
            <div className="flex gap-1.5">
              <div className="h-1 w-1 rotate-45 bg-wedding-accent opacity-50" />
              <div className="h-1 w-1 rotate-45 bg-wedding-accent" />
              <div className="h-1 w-1 rotate-45 bg-wedding-accent opacity-50" />
            </div>
            <div className="h-px w-6 bg-wedding-border-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
