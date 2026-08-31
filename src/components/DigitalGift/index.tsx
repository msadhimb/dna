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
} from "@/components/Icon"
import BankAccountCard from "./components/BankAccountCard"
import QrisCard from "./components/QrisCard"
import { useGuest } from "@/store/useGuest"
import { useImageUrl } from "@/store/useImageUrl"

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

  // ── Samakan token dengan RomanticQuote & CommentSection agar nyambung ──
  const accent = isDark ? "#FF2D55" : "#16A34A"
  const dot = isDark ? "rgba(255,45,85,0.06)" : "rgba(212,175,55,0.06)"
  const surface = isDark ? "#0A0A0A" : "#F8F8F8"
  const textPrimary = isDark ? "#FFFFFF" : "#111111"
  const textSecondary = isDark ? "#888888" : "#555555"
  const borderAccent = isDark ? "rgba(255,45,85,0.25)" : "rgba(22,163,74,0.25)"
  const bgGradient = isDark
    ? "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,45,85,0.06), transparent)"
    : "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,175,55,0.06), transparent)"

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
      {/* Dot texture — sama dengan RomanticQuote & CommentSection */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dot} 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: bgGradient }}
      />

      <div className="dg-content relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-10 md:gap-10 md:px-10">
        {/* ── Bridge dari CommentSection ── */}
        <div className="dg-bridge flex w-full max-w-xs items-center gap-3 opacity-60">
          <div className="h-px flex-1" style={{ background: borderAccent }} />
          <div className="h-1 w-1 rotate-45" style={{ background: accent, opacity: 0.5 }} />
          <div className="h-px flex-1" style={{ background: borderAccent }} />
        </div>

        {/* ── Header — gaya SectionHeader agar nyambung ── */}
        <div className="dg-header flex flex-col items-center gap-6 text-center">
          <p
            className="dg-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase"
            style={{ color: textSecondary }}
          >
            Amplop Digital
          </p>
          <h2
            className="dg-title-word font-signature font-bold leading-none"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 6rem)",
              color: textPrimary,
            }}
          >
            Wedding Gift
          </h2>
          <p
            className="dg-desc max-w-md font-sans text-sm leading-relaxed"
            style={{ color: textSecondary }}
          >
            Doa restu Anda adalah hadiah terindah. Namun jika berkenan berbagi tanda kasih, amplop digital ini kami sediakan dengan penuh terima kasih.
          </p>
        </div>

        {/* ── Envelope Illustration ── */}
        <div className="dg-envelope">
          <EnvelopeIllustration accent={accent} isDark={isDark} />
        </div>

        {/* ── Ornamental Divider — konsisten dengan CommentSection ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider color={borderAccent} />
        </div>

        {/* ── Message Card — surface & shadow sama dengan RomanticQuote ── */}
        <div
          className="dg-message group relative w-full max-w-lg px-8 py-8 text-center md:px-12 md:py-10"
          style={{
            background: surface,
            border: `1px solid ${borderAccent}`,
            borderRadius: "20px",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Wax seal overlapping top — sama seperti sebelumnya */}
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2"
            style={{ zIndex: 10 }}
          >
            <WaxSeal accent={accent} isDark={isDark} />
          </div>

          {/* Names */}
          <p
            className="font-signature font-bold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: textPrimary,
              lineHeight: 1.2,
              paddingTop: "16px",
            }}
          >
            Devi &amp; Adhim
          </p>

          {/* Inner ornament — senada dengan RomanticQuote Separator */}
          <div className="mx-auto my-4 flex items-center gap-3">
            <div
              className="h-px flex-1 max-w-12"
              style={{ background: borderAccent }}
            />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1 L7.5 4.5 L11 6 L7.5 7.5 L6 11 L4.5 7.5 L1 6 L4.5 4.5 Z"
                fill={accent}
                opacity="0.6"
              />
            </svg>
            <div
              className="h-px flex-1 max-w-12"
              style={{ background: borderAccent }}
            />
          </div>

          {/* Message */}
          <p
            className="mx-auto max-w-sm font-sans text-sm font-light leading-relaxed"
            style={{ color: textSecondary, lineHeight: 1.9 }}
          >
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
            Namun jika memberi adalah ungkapan kasih Anda, kami dengan rendah
            hati menerimanya.
          </p>
        </div>

        {/* ── Ornamental Divider ── */}
        <div className="dg-ornament-1 w-full max-w-xs">
          <OrnamentalDivider color={borderAccent} />
        </div>

        {/* ── Tab Switcher — Bank / QRIS ── */}
        <div
          className="dg-tabs flex items-center gap-1.5 rounded-full p-1.5"
          role="tablist"
          aria-label="Metode hadiah"
          style={{
            background: surface,
            border: `1px solid ${borderAccent}`,
            boxShadow: isDark
              ? "0 8px 24px -12px rgba(0,0,0,0.5)"
              : "0 8px 24px -12px rgba(0,0,0,0.12)",
          }}
        >
          <button
            onClick={() => setActiveTab("bank")}
            className="flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200"
            style={{
              background: activeTab === "bank" ? accent : "transparent",
              color: activeTab === "bank" ? "#ffffff" : textSecondary,
              boxShadow: activeTab === "bank" ? `0 4px 12px ${accent}40` : "none",
            }}
            aria-selected={activeTab === "bank"}
            role="tab"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Bank Transfer
          </button>
          <button
            onClick={() => setActiveTab("qris")}
            className="flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold tracking-[0.14em] uppercase transition-all duration-200"
            style={{
              background: activeTab === "qris" ? accent : "transparent",
              color: activeTab === "qris" ? "#ffffff" : textSecondary,
              boxShadow: activeTab === "qris" ? `0 4px 12px ${accent}40` : "none",
            }}
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
                accent={accent}
                borderAccent={borderAccent}
                isDark={isDark}
                surface={surface}
              />
            ) : (
              <>
                <BankAccountCard
                  svg={
                    "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bni.svg"
                  }
                  accountNumber="1819801119"
                  accountName="Salman Adhim"
                  accent={accent}
                  borderAccent={borderAccent}
                  isDark={isDark}
                  surface={surface}
                />
                <BankAccountCard
                  svg={
                    "https://znefanspvasmutcrbjmu.supabase.co/storage/v1/object/public/image-icon/bca.svg"
                  }
                  accountNumber="7296154554"
                  accountName="Devi Yuliana"
                  accent={accent}
                  borderAccent={borderAccent}
                  isDark={isDark}
                  surface={surface}
                />
              </>
            )}
          </div>
        ) : (
          <div className="dg-cards-wrapper relative z-10 flex w-full justify-center">
            <QrisCard
              qrisUrl={qrisUrl}
              qrisName="Devi & Adhim"
              accent={accent}
              borderAccent={borderAccent}
              isDark={isDark}
              surface={surface}
            />
          </div>
        )}

        {/* ── Closing — gaya Footer agar transisi mulus ke Footer ── */}
        <div className="dg-closing flex flex-col items-center gap-4 text-center">
          <OrnamentalDivider color={borderAccent} size="small" />

          <p
            className="max-w-md font-sans text-sm font-light leading-relaxed italic"
            style={{ color: textSecondary, lineHeight: 2 }}
          >
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak,
            Ibu, dan Saudara/i berkenan hadir untuk memberikan doa restu.
          </p>

          <div className="flex items-center gap-3">
            <div className="h-px w-6" style={{ background: borderAccent }} />
            <div className="flex gap-1.5">
              <div className="h-1 w-1 rotate-45" style={{ background: accent, opacity: 0.5 }} />
              <div className="h-1 w-1 rotate-45" style={{ background: accent }} />
              <div className="h-1 w-1 rotate-45" style={{ background: accent, opacity: 0.5 }} />
            </div>
            <div className="h-px w-6" style={{ background: borderAccent }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default DigitalGift
