"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { Volume2, VolumeX, Moon, Sun, Settings, X, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

export const Tools = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
      {/* Audio Element */}
      <audio ref={audioRef} loop />

      {/* Child Buttons Container */}
      <div
        className={cn(
          "flex flex-col items-center gap-3 transition-all duration-300 ease-in-out",
          isOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-10 opacity-0 pointer-events-none"
        )}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110"
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-3 w-3 text-white" />
          ) : (
            <Moon className="h-3 w-3 text-muted" />
          )}
        </button>

        {/* Music Toggle */}
        <button
          onClick={togglePlay}
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

      {/* Main FAB */}
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
