"use client"

import { useGuest } from "@/store/useGuest"
import { useEffect, useMemo, useState } from "react"

const TZ = "Asia/Jakarta"
const TZ_OFFSET = "+07:00"

type CountdownEvent = {
  date: Date
  title: string
  detail: string
}

type TimeLeft = {
  totalSeconds: number
  isStarted: boolean // waktu acara sudah tercapai
  isFinished: boolean // hari H sudah lewat (lewat 23:59 WIB)
  d: number
  h: number
  m: number
  s: number
  units: { value: number; label: string }[]
}

export const useCountdown = () => {
  const { guest } = useGuest()
  const [now, setNow] = useState(() => new Date())

  const mantuDate = process.env.NEXT_PUBLIC_MANTU_DATE
  const unduhDate = process.env.NEXT_PUBLIC_UNDUH_DATE

  // parse string tanpa offset sebagai WIB
  const parseWIB = (s?: string): Date | null => {
    if (!s) return null
    const hasTz = /([zZ]|[+-]\d{2}:?\d{2})$/.test(s)
    const d = new Date(hasTz ? s : `${s}${TZ_OFFSET}`)
    return isNaN(d.getTime()) ? null : d
  }

  // "YYYY-MM-DD" di zona WIB
  const dayKey = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ })

  const isSameDay = (a: Date, b: Date) => dayKey(a) === dayKey(b)

  const endOfDay = (d: Date) =>
    new Date(`${dayKey(d)}T23:59:59.999${TZ_OFFSET}`)

  const buildTimeLeft = (target: Date | null, now: Date): TimeLeft => {
    const totalSeconds = target
      ? Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000))
      : 0

    const d = Math.floor(totalSeconds / 86400)
    const h = Math.floor((totalSeconds % 86400) / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    return {
      totalSeconds,
      isStarted: target ? now >= target : false,
      isFinished: target ? now > endOfDay(target) : true,
      d,
      h,
      m,
      s,
      units: [
        { value: d, label: "Hari" },
        { value: h, label: "Jam" },
        { value: m, label: "Menit" },
        { value: s, label: "Detik" },
      ],
    }
  }

  const mantu = useMemo(() => parseWIB(mantuDate), [mantuDate])
  const unduh = useMemo(() => parseWIB(unduhDate), [unduhDate])

  const events = useMemo<CountdownEvent[]>(() => {
    const list: { date: Date | null; title: string; detail: string }[] = []

    if (guest?.mantu_status) {
      list.push({
        date: mantu,
        title: "Menuju Acara Pernikahan",
        detail: "Acara Pernikahan",
      })
    }
    if (guest?.unduh_mantu_status) {
      list.push({
        date: unduh,
        title: "Menuju Acara Ngunduh Mantu",
        detail: "Acara Ngunduh Mantu",
      })
    }

    return list
      .filter((e): e is CountdownEvent => e.date !== null)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [guest?.mantu_status, guest?.unduh_mantu_status, mantu, unduh])

  // countdown per acara (selalu tersedia, terlepas dari event aktif)
  const mantuTimeLeft = buildTimeLeft(mantu, now).totalSeconds
  const unduhMantuTimeLeft = buildTimeLeft(unduh, now).totalSeconds

  // event tetap "aktif" sampai akhir hari H (WIB)
  const currentEvent: any = events.find((e) => now <= endOfDay(e.date))

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const base = {
    unduhMantuDate: unduhDate,
    mantuDate,
    mantuTimeLeft,
    unduhMantuTimeLeft,
    isMantuDay: mantu ? isSameDay(now, mantu) : false,
    isUnduhDay: unduh ? isSameDay(now, unduh) : false,
  }

  const current = buildTimeLeft(events[0].date, now)

  if (!currentEvent) {
    return {
      ...base,
      title: "",
      detailTitle: "",
      isEventDay: false,
      isStarted: false,
      isFinished: true,
      timeLeft: current.totalSeconds,
      units: current.units,
    }
  }

  return {
    ...base,
    title: currentEvent.title,
    detailTitle: currentEvent.detail,
    isEventDay: isSameDay(now, currentEvent.date),
    isStarted: current.isStarted,
    isFinished: false,
    timeLeft: current.totalSeconds,
    units: current.units,
  }
}
