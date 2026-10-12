"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { QRCodeSVG } from "qrcode.react"
import { CheckCircle2 } from "lucide-react"
import Header from "../Header"
import { Card } from "../Card"
import { Countdown } from "../CountDown"
import { useGuest } from "@/store/useGuest"
import {
  UNDUH_DATE_ISO,
  MANTU_DATE_ISO,
  getActiveEvent,
  isCheckedForActiveEvent,
} from "@/helper/eventSchedule"

const CheckInTicket = ({
  guestId,
  guestName,
}: {
  guestId?: string
  guestName?: string
}) => {
  const { guest } = useGuest()
  const setGuest = useGuest((state) => state.setGuest)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const resolvedGuest = guestId && guest?.id === guestId ? guest : null
  const displayName = guestName ?? resolvedGuest?.full_name ?? ""
  const activeEvent = getActiveEvent(
    resolvedGuest ?? { mantu_status: true, unduh_mantu_status: false },
    now
  )
  const isChecked = resolvedGuest
    ? isCheckedForActiveEvent(resolvedGuest, activeEvent)
    : false

  const hasBoth = !!(
    resolvedGuest?.mantu_status && resolvedGuest?.unduh_mantu_status
  )
  const waitingUnduh = hasBoth && isChecked && activeEvent === "mantu"

  const statusQuery = useQuery({
    queryKey: ["guest-status", guestId],
    queryFn: async () => {
      const res = await fetch(`/api/guest-status/${guestId}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error("Gagal memuat status check-in")
      return res.json()
    },
    refetchInterval: 5_000,
    enabled: !!guestId && !!resolvedGuest && !isChecked && !waitingUnduh,
    retry: false,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    const data = statusQuery.data
    if (!data || !guestId) return
    const current = useGuest.getState().guest
    if (!current || current.id !== guestId) return
    if (
      (current.checked_in_at ?? null) !== (data.checked_in_at ?? null) ||
      (current.checked_in_at_mantu ?? null) !==
        (data.checked_in_at_mantu ?? null) ||
      (current.checked_in_at_unduh ?? null) !==
        (data.checked_in_at_unduh ?? null)
    ) {
      setGuest({
        ...current,
        checked_in_at: data.checked_in_at ?? null,
        checked_in_at_mantu: data.checked_in_at_mantu ?? null,
        checked_in_at_unduh: data.checked_in_at_unduh ?? null,
      })
    }
  }, [statusQuery.data, guestId, setGuest])

  if (!guestId) return null

  const activeLabel =
    activeEvent === "mantu" ? "Hari Pernikahan" : "Hari Ngunduh Mantu"
  const activeDateTarget =
    activeEvent === "mantu" ? MANTU_DATE_ISO : UNDUH_DATE_ISO

  // Sudah check-in untuk fase aktif -> QR hilang.
  if (resolvedGuest && (isChecked || waitingUnduh)) {
    return (
      <section
        id="check-in-ticket"
        className="relative w-full scroll-mt-16 overflow-hidden bg-background gsap-element"
      >
        <div className="relative z-40 mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-1">
          <Header
            subHeader="Check-in"
            title="Tiket Masuk"
            subTitle={
              waitingUnduh
                ? "Check-in Pernikahan selesai. QR Ngunduh Mantu akan muncul sesuai tanggalnya."
                : "Tiket ini sudah dipindai panitia. Terima kasih atas kehadiran Anda."
            }
          />

          <div className="flex justify-center">
            <Card className="w-full max-w-md items-center gap-4 p-6 text-center md:p-8">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </span>
              {displayName ? (
                <p className="text-lg font-semibold">{displayName}</p>
              ) : null}
              <p className="text-sm font-medium text-emerald-600">
                {waitingUnduh
                  ? "Sampai jumpa di Ngunduh Mantu"
                  : "Sudah check-in"}
              </p>
              {waitingUnduh ? (
                <div className="w-full rounded-2xl bg-wedding-surface/60 p-4">
                  <Countdown event="unduh" />
                </div>
              ) : null}
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="check-in-ticket"
      className="relative w-full scroll-mt-16 overflow-hidden bg-background gsap-element"
    >
      <div className="relative z-40 mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-1">
        <Header
          subHeader="Check-in"
          title="Tiket Masuk"
          subTitle="Tunjukkan tiket ini kepada panitia saat tiba di lokasi acara. Simpan tangkapan layar agar mudah dibuka kembali."
        />

        <div className="flex justify-center">
          <Card className="w-full max-w-md items-center gap-4 p-6 text-center md:p-8">
            {hasBoth ? (
              <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-wedding-accent">
                {activeLabel}
              </p>
            ) : null}
            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/${guestId}`
                    : guestId
                }
                size={200}
              />
            </div>
            {displayName ? (
              <p className="text-lg font-semibold">{displayName}</p>
            ) : null}
            {hasBoth ? (
              <div className="w-full">
                <Countdown targetDate={activeDateTarget} event={activeEvent} />
              </div>
            ) : null}
            <p className="text-sm text-wedding-text-secondary">
              Satu tiket berlaku untuk satu undangan. Panitia akan memindai
              tiket ini pada saat check-in.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default CheckInTicket
