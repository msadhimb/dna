"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Gift,
  MapPin,
  Menu,
  MessageCircle,
  Pause,
  Play,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStoryAutoPlay } from "@/hooks/useStoryAutoPlay"

const LINKS = [
  {
    id: "time-and-place",
    label: "Waktu & Tempat",
    hint: "Tanggal, jam & lokasi",
    Icon: MapPin,
  },
  {
    id: "comment",
    label: "Ucapan & Doa",
    hint: "Titip doa untuk kami",
    Icon: MessageCircle,
  },
  {
    id: "digital-gift",
    label: "Wedding Gift",
    hint: "Tanda kasih untuk kami",
    Icon: Gift,
  },
] as const

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  // Offset lembut agar judul section tidak tertutup menu.
  const y = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top: y, behavior: "smooth" })
}

/**
 * Navigasi sequence: tombol kanan-atas + panel lompat antar bagian
 * (TimeAndPlace, Comment, DigitalGift) + putar Our Story otomatis.
 * Mengikuti bahasa visual undangan: surface solid, serif, aksen wedding.
 */
export const SequenceNav = ({ visible = true }: { visible?: boolean }) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { isPlaying, toggle } = useStoryAutoPlay({ targetId: "time-and-place" })

  // Stabil mount: wrapper SELALU dirender (bahkan saat hidden) agar React
  // tidak melakukan insertBefore di commit yang sama dengan GSAP pin-spacer
  // yang membungkus #master-trigger saat isLoaded=true.
  // Visibilitas hanya via CSS + aria-hidden.
  // Satu authored moment: tombol turun lembut sekali saat pertama terlihat.
  useEffect(() => {
    if (!visible || !navRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const el = navRef.current
    const anim = el.animate(
      [
        { opacity: "0", transform: "translateY(-10px)" },
        { opacity: "1", transform: "translateY(0)" },
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

  // Tutup saat klik di luar atau tekan Escape.
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open ])

  const go = useCallback((id: string) => {
    setOpen(false)
    // Tunggu panel mulai menutup agar scroll terasa mulus.
    requestAnimationFrame(() => scrollToSection(id))
  }, [])

  const onStory = useCallback(() => {
    toggle()
    setOpen(false)
  }, [toggle])

  const tabbable = open && visible

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-end transition-opacity duration-500",
        "pr-4 pt-4 sm:pr-6 sm:pt-5",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      style={{ top: "max(0rem, env(safe-area-inset-top, 0px))" }}
    >
      <nav
        ref={navRef}
        data-story-nav
        aria-label="Navigasi undangan"
        className={cn(!visible && "pointer-events-none invisible")}
      >
        <div className="pointer-events-auto relative">
          {/* Tombol menu */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            data-story-nav
            aria-expanded={open}
            aria-controls="sequence-menu"
            aria-label={open ? "Tutup navigasi" : "Buka navigasi"}
            title={open ? "Tutup navigasi" : "Buka navigasi"}
            tabIndex={visible ? 0 : -1}
            className={cn(
              "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full",
              "border border-wedding-border bg-wedding-surface text-wedding-text-primary shadow-wedding-card",
              "supports-[backdrop-filter]:bg-wedding-surface/70 supports-[backdrop-filter]:backdrop-blur-xl supports-[backdrop-filter]:backdrop-saturate-150",
              "supports-[backdrop-filter]:ring-1 supports-[backdrop-filter]:ring-inset supports-[backdrop-filter]:ring-white/15",
              "transition-colors duration-200 hover:text-wedding-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-accent"
            )}
          >
            <span className="relative block h-5 w-5" aria-hidden="true">
              <Menu
                strokeWidth={2}
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100"
                )}
              />
              <X
                strokeWidth={2}
                className={cn(
                  "absolute inset-0 h-5 w-5 transition-opacity duration-200",
                  open ? "opacity-100" : "opacity-0"
                )}
              />
            </span>
          </button>

          {/* Panel dropdown */}
          <div
            id="sequence-menu"
            role="menu"
            aria-hidden={!open}
            className={cn(
              "absolute top-[calc(100%+10px)] right-0 w-72 origin-top-right overflow-hidden rounded-[24px]",
              "border border-wedding-border bg-wedding-surface shadow-wedding-card",
              "supports-[backdrop-filter]:bg-wedding-surface/80 supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150",
              "supports-[backdrop-filter]:ring-1 supports-[backdrop-filter]:ring-inset supports-[backdrop-filter]:ring-white/10",
              "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              open
                ? "pointer-events-auto visible scale-100 opacity-100 translate-y-0"
                : "pointer-events-none invisible scale-[0.97] opacity-0 -translate-y-1"
            )}
          >
            {/* Tepi cahaya kaca: satu garis pantulan di sisi atas panel */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/30 dark:bg-white/15"
            />
            <p className="px-6 pt-5 pb-2 font-serif text-[17px] font-medium italic text-wedding-text-primary">
              Lompat ke bagian…
            </p>

            <ul className="flex flex-col gap-1 px-3 pt-1 pb-3">
              {LINKS.map(({ id, label, hint, Icon }) => {
                const active = activeId === id
                return (
                  <li key={id}>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => go(id)}
                      data-story-nav
                      aria-current={active ? "location" : undefined}
                      tabIndex={tabbable ? 0 : -1}
                      className={cn(
                        "group flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-accent",
                        active
                          ? "bg-wedding-accent/15"
                          : "hover:bg-wedding-text-primary/[0.05]"
                      )}
                    >
                      <Icon
                        strokeWidth={2}
                        aria-hidden="true"
                        className={cn(
                          "h-5 w-5 shrink-0 transition-colors duration-200",
                          active
                            ? "text-wedding-accent"
                            : "text-wedding-text-secondary group-hover:text-wedding-text-primary"
                        )}
                      />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="font-serif text-[17px] leading-snug font-medium text-wedding-text-primary">
                          {label}
                        </span>
                        <span className="font-serif text-[13px] leading-relaxed italic text-wedding-text-secondary">
                          {hint}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="mx-6 h-px bg-wedding-border" />

            {/* Putar Our Story */}
            <div className="p-3">
              <button
                type="button"
                role="menuitemcheckbox"
                onClick={onStory}
                data-story-nav
                aria-checked={isPlaying}
                tabIndex={tabbable ? 0 : -1}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wedding-accent",
                  isPlaying
                    ? "bg-wedding-accent/15"
                    : "hover:bg-wedding-text-primary/[0.05]"
                )}
              >
                {isPlaying ? (
                  <Pause
                    strokeWidth={2}
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-wedding-accent"
                  />
                ) : (
                  <Play
                    strokeWidth={2}
                    aria-hidden="true"
                    className="ml-px h-5 w-5 shrink-0 text-wedding-text-secondary"
                  />
                )}
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="font-serif text-[17px] leading-snug font-medium text-wedding-text-primary">
                    {isPlaying ? "Hentikan Story" : "Putar Story"}
                  </span>
                  <span className="font-serif text-[13px] leading-relaxed italic text-wedding-text-secondary">
                    Berhenti di Waktu &amp; Tempat
                  </span>
                </span>
              </button>
            </div>

            <span className="sr-only">
              Our Story diputar otomatis dan berhenti di Waktu &amp; Tempat.
            </span>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default SequenceNav
