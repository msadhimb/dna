"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Volume2, VolumeX, Moon, Sun, Settings, X, Music2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAudio, AudioTrack } from "@/store/useAudio"

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

  useEffect(() => setMounted(true), [])

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

  // Play/pause sinkron dengan store — dipicu oleh tap di WelcomeSection atau tombol Tools
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !src) return
    audio.volume = volume
    if (isPlaying) {
      audio.play().catch(() => {
        // jika masih block (user belum tap Welcome), biarkan isPlaying true, akan coba lagi saat Welcome di-tap
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
    const onPlay = () => setIsPlaying(true)
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

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Judul — tetap di atas logo setting, naik saat expand */}
      <div
        className={cn(
          "pointer-events-none absolute right-0 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-muted dark:text-white shadow-xl transition-all duration-300",
          isOpen ? "bottom-28" : "bottom-10",
          showTitle
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
          onClick={() => toggle()}
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
