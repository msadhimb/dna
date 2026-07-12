"use client"

import React, { useEffect, useState } from "react"

interface CountdownProps {
  targetDate?: string
}

export function Countdown({
  targetDate = "2026-12-25T09:00:00",
}: CountdownProps) {
  const [time, setTime] = useState<{
    d: number
    h: number
    m: number
    s: number
  } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const calc = () => {
      const diff = +new Date(targetDate) - +new Date()
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
  }, [targetDate])

  if (!mounted || !time) {
    return <div className="h-16" />
  }

  const units = [
    { value: time.d, label: "Hari" },
    { value: time.h, label: "Jam" },
    { value: time.m, label: "Menit" },
    { value: time.s, label: "Detik" },
  ]

  return (
    <div className="flex flex-col items-center gap-1 font-bold text-primary">
      <p className="font-signature text-xl font-light tracking-wider">
        Hitungan Mundur Pernikahan
      </p>
      <div className="flex items-center gap-1 font-bold text-primary">
        {units.map((u, i) => (
          <React.Fragment key={i}>
            <div className="flex min-w-[3.5rem] flex-col items-center md:min-w-[4.5rem]">
              <span className="font-serif text-3xl leading-none tracking-tight tabular-nums md:text-5xl">
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
