// "use client"

import { getTimeLeft } from "@/helper/getTimeLeft"
import { useGuest } from "@/store/useGuest"
import { useEffect, useMemo, useState } from "react"

type CountdownEvent = {
  date: Date
  title: string
}

export const useCountdown = () => {
  const { guest } = useGuest()
  const [now, setNow] = useState(() => new Date())

  // update tiap detik

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  const endOfDay = (d: Date) => {
    const end = new Date(d)
    end.setHours(23, 59, 59, 999)
    return end
  }

  // daftar event, urut dari yang paling awal
  const events = useMemo<CountdownEvent[]>(() => {
    const list = [
      ...(guest?.mantu_status
        ? [
            {
              date: process.env.NEXT_PUBLIC_MANTU_DATE,
              title: "Menuju Acara Pernikahan",
              detail: "Acara Pernikahan",
            },
          ]
        : []),
      ...(guest?.unduh_mantu_status
        ? [
            {
              date: process.env.NEXT_PUBLIC_UNDUH_DATE,
              title: "Menuju Acara Ngunduh Mantu",
              detail: "Acara Ngunduh Mantu",
            },
          ]
        : []),
    ]

    return list
      .filter((e) => !!e.date)
      .map((e) => ({
        title: e.title,
        date: new Date(e.date as string),
        detail: e.detail,
      }))
      .filter((e) => !isNaN(e.date.getTime()))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [guest?.mantu_status, guest?.unduh_mantu_status])

  const currentEvent: any = events.find((e) => now <= endOfDay(e.date)) ?? null

  console.log(currentEvent)

  const units = [
    { value: getTimeLeft(currentEvent?.date)?.d, label: "Hari" },
    { value: getTimeLeft(currentEvent?.date)?.h, label: "Jam" },
    { value: getTimeLeft(currentEvent?.date)?.m, label: "Menit" },
    { value: getTimeLeft(currentEvent?.date)?.s, label: "Detik" },
  ]

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!currentEvent) {
    return {
      title: "",
      detailTitle: "",
      isEventDay: false,
      isFinished: true, // semua event sudah lewat
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      unduhMantuDate: process.env.NEXT_PUBLIC_UNDUH_DATE,
      mantuDate: process.env.NEXT_PUBLIC_MANTU_DATE,
    }
  }

  return {
    title: currentEvent.title,
    detailTitle: currentEvent.detail,
    isEventDay: isSameDay(now, currentEvent.date), // true tepat di hari H
    isFinished: false,
    timeLeft: getTimeLeft(currentEvent.date),
    units,
    unduhMantuDate: process.env.NEXT_PUBLIC_UNDUH_DATE,
    mantuDate: process.env.NEXT_PUBLIC_MANTU_DATE,
  }
}
