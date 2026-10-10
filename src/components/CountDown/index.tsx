"use client"

import React, { useEffect, useState } from "react"
import { useGuest } from "@/store/useGuest"

interface CountdownProps {
  targetDate?: string
}

export function Countdown({
  targetDate = "2026-12-12T09:00:00",
}: CountdownProps) {
  const { guest } = useGuest()

  const [time, setTime] = useState<{
    d: number
    h: number
    m: number
    s: number
  } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [caption, setCaption] = useState("")

  useEffect(() => {
    setMounted(true)
    const mantuDate = "2026-12-12T09:00:00"
    const unduhDate = "2026-12-26T11:00:00"
    
    const calc = () => {
      let finalTargetDate = targetDate
      let currentCaption = ""

      if (guest) {
        if (guest.mantu_status && guest.unduh_mantu_status) {
          const now = new Date().getTime()
          if (now > new Date(mantuDate).getTime()) {
            finalTargetDate = unduhDate
            currentCaption = "Menuju Ngunduh Mantu"
          } else {
            finalTargetDate = mantuDate
            currentCaption = "Menuju Hari Pernikahan"
          }
        } else if (guest.unduh_mantu_status) {
          finalTargetDate = unduhDate
          currentCaption = "Menuju Ngunduh Mantu"
        } else {
          finalTargetDate = mantuDate
          currentCaption = "Menuju Hari Pernikahan"
        }
      }

      setCaption(currentCaption)
      const diff = +new Date(finalTargetDate) - +new Date()
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }
      return {
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60),
      }
    }

    setTime(calc())
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [guest, targetDate])

  if (!mounted || !time) {
    return <div className="h-16" />
  }

  const units = [
    { value: time.d, label: "Hari" },
    { value: time.h, label: "Jam" },
    { value: time.m, label: "Menit" },
    { value: time.s, label: "Detik" },
  ]

  const isFinished = time.d === 0 && time.h === 0 && time.m === 0 && time.s === 0

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center gap-1 font-bold text-primary animate-fade-up">
        {caption && (
          <span className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase opacity-80 md:text-xs">
            {caption}
          </span>
        )}
        <span className="font-signature text-4xl leading-none tracking-tight md:text-6xl">
          Acara Telah Dimulai
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-1 font-bold  text-primary">
      {caption && (
        <span className="mb-3 text-[10px] font-medium tracking-[0.3em] uppercase opacity-80 md:text-xs">
          {caption}
        </span>
      )}
      <div className="flex items-center gap-1 font-bold text-primary">
        {units.map((u, i) => (
          <React.Fragment key={i}>
            <div className="flex min-w-14 flex-col items-center md:min-w-18">
              <span className="text-3xl leading-none tracking-tight tabular-nums md:text-5xl font-signature">
                {String(u.value).padStart(2, "0")}
              </span>
              <span className="mt-1.5 text-[9px] font-medium tracking-[0.3em] uppercase md:text-[10px]">
                {u.label}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className="-mt-4 font-serif text-2xl select-none md:text-4xl">
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
