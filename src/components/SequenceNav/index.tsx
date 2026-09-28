"use client"

import { useEffect, useRef, useState } from "react"
import {
  Gift,
  MapPin,
  MessageCircle,
  Pause,
  Play,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStoryAutoPlay } from "@/hooks/useStoryAutoPlay"

const LINKS = [
  { id: "time-and-place", label: "Waktu", full: "Ke Waktu & Tempat", Icon: MapPin },
  { id: "comment", label: "Ucapan", full: "Ke Ucapan & Doa", Icon: MessageCircle },
  { id: "digital-gift", label: "Gift", full: "Ke Wedding Gift", Icon: Gift },
] as const

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // Offset lembut agar judul section tidak tertutup pill.
  const y = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top: y, behavior: "smooth" })
}

/**
 * Navigasi sequence: pill bawah-tengah untuk lompat ke TimeAndPlace,
 * Comment, DigitalGift + tombol putar Our Story otomatis yang berhenti
 * di TimeAndPlace saja.
 */
export const SequenceNav = ({ visible = true }: { visible?: boolean }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const { isPlaying, toggle } = useStoryAutoPlay({ targetId: "time-and-place" })

  // Stabil mount: wrapper SELALU dirender (bahkan saat hidden) agar React
  // tidak melakukan insertBefore di commit yang sama dengan GSAP pin-spacer
  // yang membungkus #master-trigger saat isLoaded=true.
  // Visibilitas hanya via CSS + aria-hidden.
  // Satu authored moment: pill naik sekali saat pertama terlihat.
  useEffect(() => {
    if (!visible || !navRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = navRef.current
    const anim = el.animate(
      [
        { opacity: "0", transform: "translateY(14px) scale(0.98)" },
        { opacity: "1", transform: "translateY(0) scale(1)" },
      ],
      { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
    )
    return () => anim.cancel()
  }, [visible])

  // Tandai section aktif agar posisi pembaca selalu jelas.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    )
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 flex justify-center transition-opacity duration-500",
        "pr-[76px] pl-4 sm:px-4",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px) + 0.75rem)" }}
    >
      <nav
        ref={navRef}
        data-story-nav
        aria-label="Navigasi undangan"
        className={cn(
          "pointer-events-auto relative flex items-center gap-0.5 rounded-full px-1.5 py-1.5",
          "border border-[#c9a227]/25 bg-[#fdfbf6]/85 shadow-[0_16px_44px_-12px_rgba(30,26,20,0.35),0_2px_10px_-2px_rgba(30,26,20,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl",
          "dark:border-white/10 dark:bg-[#141010]/75 dark:shadow-[0_16px_44px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]",
          !visible && "pointer-events-none invisible"
        )}
      >
        {/* Hairline emas di bibir atas pill */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a227]/50 to-transparent dark:via-[#c9a227]/40"
        />
        <button
          type="button"
          onClick={toggle}
          data-story-nav
          aria-pressed={isPlaying}
          aria-label={isPlaying ? "Hentikan Our Story" : "Putar Our Story otomatis"}
          title={isPlaying ? "Hentikan Our Story" : "Putar Our Story otomatis"}
          className={cn(
            "relative flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-sans text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]/60",
            isPlaying
              ? "bg-[#c9a227]/15 text-[#6d5410] dark:bg-[#c9a227]/15 dark:text-[#eddfa8]"
              : "text-[#8a7a63] hover:bg-[#1e1a14]/[0.05] hover:text-[#1e1a14] dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
          )}
        >
          {isPlaying ? (
            <Pause className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
          ) : (
            <Play className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
          )}
          <span className="hidden min-[420px]:inline">Story</span>
          {isPlaying && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full ring-1 ring-[#c9a227]/40 ring-inset"
            />
          )}
        </button>

        <span
          aria-hidden="true"
          className="mx-0.5 h-4 w-px bg-[#c9a227]/25 dark:bg-white/10"
        />

        {LINKS.map(({ id, label, full, Icon }) => {
          const active = activeId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              data-story-nav
              aria-label={full}
              title={full}
              aria-current={active ? "location" : undefined}
              className={cn(
                "relative flex cursor-pointer items-center gap-1.5 rounded-full px-3 pt-2 pb-2.5 font-sans text-[10px] font-medium tracking-[0.18em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227]/60",
                active
                  ? "bg-[#1e1a14]/[0.07] text-[#1e1a14] dark:bg-white/[0.12] dark:text-white"
                  : "text-[#8a7a63] hover:bg-[#1e1a14]/[0.05] hover:text-[#1e1a14] dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
              )}
            >
              <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} />
              <span className="hidden min-[420px]:inline">{label}</span>
              {/* Indikator emas — selalu terlihat walau label disembunyikan di layar sempit */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-[5px] mx-auto h-[3px] w-[3px] rounded-full bg-[#c9a227] transition-all duration-300",
                  active ? "scale-100 opacity-100" : "scale-0 opacity-0"
                )}
              />
            </button>
          )
        })}

        <span className="sr-only">
          Our Story diputar otomatis dan berhenti di Waktu & Tempat.
        </span>
      </nav>
    </div>
  )
}

export default SequenceNav
