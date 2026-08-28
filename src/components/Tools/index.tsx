"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Volume2, VolumeX, Moon, Sun, Settings, X, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudio, AudioTrack } from "@/store/useAudio"
import { useScroll } from "@/hooks/useScroll"

export const Tools = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const {
    isPlaying,
    src,
    title,
    playlist,
    volume,
    setIsPlaying,
    toggle,
    setPlaylist,
    next,
  } = useAudio()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const { scrollY } = useScroll()
  const hasAutoPlayedRef = useRef(false)
  // true kalau browser sempat menolak play() (belum ada user gesture yang valid)
  const [needsUserAction, setNeedsUserAction] = useState(false)

  useEffect(() => setMounted(true), [])

  // Trigger utama: gesture asli (click/touchstart) di mana pun di dokumen.
  // Browser hanya mengizinkan audio.play() kalau dipicu oleh gesture asli
  // seperti click/touchstart/keydown — scroll TIDAK dihitung sebagai gesture valid,
  // makanya auto-play dari scroll saja sering gagal diam-diam.
  useEffect(() => {
    if (hasAutoPlayedRef.current || isPlaying) return

    const handler = () => {
      hasAutoPlayedRef.current = true
      setIsPlaying(true)
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("keydown", handler)
    }

    document.addEventListener("click", handler, { once: true })
    document.addEventListener("touchstart", handler, { once: true })
    document.addEventListener("keydown", handler, { once: true })

    return () => {
      document.removeEventListener("click", handler)
      document.removeEventListener("touchstart", handler)
      document.removeEventListener("keydown", handler)
    }
  }, [isPlaying, setIsPlaying])

  // Trigger sekunder: scroll pertama kali. Ini tetap dicoba karena kadang
  // scroll di beberapa browser/kondisi sudah dianggap cukup "sticky activation",
  // tapi kalau gagal kita tidak diam-diam — lihat effect play/pause di bawah.
  useEffect(() => {
    if (hasAutoPlayedRef.current) return
    if (isPlaying) {
      hasAutoPlayedRef.current = true
      return
    }
    if (scrollY > 10) {
      hasAutoPlayedRef.current = true
      setIsPlaying(true)
    }
  }, [scrollY, isPlaying, setIsPlaying])

  // Load apapun yang ada di public/audio
  useEffect(() => {
    let cancelled = false
    fetch("/api/audio", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        const tracks: AudioTrack[] = json?.data ?? []
        if (tracks.length > 0) setPlaylist(tracks)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [setPlaylist])

  // Play/pause sinkron dengan store.
  // Kalau play() ditolak browser (belum ada gesture valid), kita catat lewat
  // needsUserAction alih-alih menelan errornya diam-diam seperti sebelumnya.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return
    audio.volume = volume
    if (isPlaying) {
      audio
        .play()
        .then(() => setNeedsUserAction(false))
        .catch(() => {
          // Masih diblokir browser: biarkan isPlaying true di store,
          // tapi tampilkan prompt kecil supaya user bisa tap untuk mulai.
          setNeedsUserAction(true)
        })
    } else {
      audio.pause()
    }
  }, [isPlaying, src, volume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  // Sync native events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => {
      setIsPlaying(true)
      setNeedsUserAction(false)
    }
    const onPause = () => setIsPlaying(false)
    const onEnded = () => {
      if (playlist.length > 1) next()
    }
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)
    return () => {
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [setIsPlaying, playlist.length, next])

  // Judul muncul 2 detik ketika lagu diputar
  useEffect(() => {
    if (!title || !isPlaying) {
      setShowTitle(false)
      return
    }
    setShowTitle(true)
    const t = setTimeout(() => setShowTitle(false), 2000)
    return () => clearTimeout(t)
  }, [title, isPlaying, src])

  const isDark = resolvedTheme === "dark"
  const shouldLoop = playlist.length <= 1

  // Tap di mana pun pada prompt ini SELALU berupa gesture asli (click),
  // jadi audio.play() yang dipanggil langsung di sini pasti diizinkan browser.
  const handleUnlockAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    audio
      .play()
      .then(() => setNeedsUserAction(false))
      .catch(() => {})
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Prompt kecil kalau autoplay diblokir browser */}
      {needsUserAction && (
        <button
          onClick={handleUnlockAudio}
          className="pointer-events-auto absolute bottom-10 right-0 flex items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-xs font-medium text-muted shadow-xl transition-all duration-300 hover:scale-105 dark:text-white"
        >
          <Music2 className="h-3.5 w-3.5 shrink-0" />
          Tap untuk putar musik
        </button>
      )}

      {/* Judul — tetap di atas logo setting, naik saat expand */}
      <div
        className={cn(
          "pointer-events-none absolute right-0 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-muted dark:text-white shadow-xl transition-all duration-300",
          isOpen ? "bottom-28" : "bottom-10",
          showTitle && !needsUserAction
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
        aria-live="polite"
      >
        <Music2 className="h-3.5 w-3.5 shrink-0" />
        <span className="max-w-60 truncate whitespace-nowrap">{title}</span>
      </div>

      <audio
        ref={audioRef}
        src={src || undefined}
        loop={shouldLoop}
        preload="auto"
        playsInline
      />

      <div
        className={cn(
          "flex flex-col items-center gap-3 transition-all duration-300 ease-in-out",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-3 w-3 text-white" />
          ) : (
            <Moon className="h-3 w-3 text-muted" />
          )}
        </button>

        <button
          onClick={() => {
            toggle()
            if (audioRef.current?.paused === false) setNeedsUserAction(false)
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          aria-label="Toggle Music"
        >
          {isPlaying ? (
            <Volume2 className="h-3 w-3 dark:text-white text-muted" />
          ) : (
            <VolumeX className="h-3 w-3 dark:text-white text-muted" />
          )}
        </button>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 hover:scale-105",
          isOpen && "rotate-90 bg-muted text-muted-foreground"
        )}
        aria-label="Tools"
      >
        {isOpen ? (
          <X className="h-4 w-4 dark:text-white text-primary" />
        ) : (
          <Settings className="h-4 w-4 dark:text-white text-muted" />
        )}
      </button>
    </div>
  )
}

export default Tools
