import React from "react"
import Header from "../Header"
import Card from "../Card"
import { QRCodeSVG } from "qrcode.react"
import { useGuest } from "@/store/useGuest"
import { useCountdown } from "@/hooks/useCountDown"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2 } from "lucide-react"
import { Countdown } from "../CountDown"

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

type TicketView = "checked-in" | "countdown" | "qr"

const CheckInTicket = ({ guestId }: { guestId: string }) => {
  const { guest } = useGuest()
  const { title, detailTitle, isEventDay, unduhMantuDate } = useCountdown()

  // status terbaru dari polling (asumsi response berisi field yang sama dengan guest)
  const { data: status } = useQuery({
    queryKey: ["guest-status", guestId],
    queryFn: async () => {
      const res = await fetch(`/api/guest-status/${guestId}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error("Gagal memuat status check-in")
      return res.json()
    },
    refetchInterval: 5_000,
    // berhenti polling setelah check-in terakhir selesai
    enabled: !!guestId && !guest?.checked_in_at_unduh,
    retry: false,
    refetchOnWindowFocus: true,
  })

  // data polling menang atas data store
  const isCheckedInAtMantu = !!(
    status?.checked_in_at_mantu ?? guest?.checked_in_at_mantu
  )
  const isCheckedInAtUnduhMantu = !!(
    status?.checked_in_at_unduh ?? guest?.checked_in_at_unduh
  )
  const hasBothStatus = !!(guest?.mantu_status && guest?.unduh_mantu_status)

  const isUnduhDay = isEventDay

  const view: TicketView = (() => {
    if (isCheckedInAtUnduhMantu) return "checked-in"
    if (isCheckedInAtMantu) {
      if (!hasBothStatus) return "checked-in"
      if (isUnduhDay) return "qr"
      if (isEventDay) return "checked-in"
      return "countdown"
    }
    return isEventDay ? "qr" : "countdown"
  })()

  const showQr = view === "qr"

  useQuery({
    queryKey: ["guest-status", guestId],
    queryFn: async () => {
      const res = await fetch(`/api/guest-status/${guestId}`, {
        cache: "no-store",
      })
      if (!res.ok) throw new Error("Gagal memuat status check-in")
      return res.json()
    },
    refetchInterval: 5_000,
    // polling hanya saat QR tampil, supaya tampilan berubah otomatis setelah discan
    enabled: !!guestId && showQr,
    retry: false,
    refetchOnWindowFocus: true,
  })

  if (view === "checked-in") {
    // countdown hanya untuk tamu yang punya dua undangan dan belum check-in di Ngunduh Mantu
    const showCountdown = hasBothStatus && !isCheckedInAtUnduhMantu

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
              showCountdown
                ? "Check-in Pernikahan selesai. QR Ngunduh Mantu akan muncul sesuai tanggalnya."
                : "Tiket ini sudah dipindai panitia. Terima kasih atas kehadiran Anda."
            }
          />

          <div className="flex justify-center">
            <Card className="w-full max-w-md items-center gap-4 p-6 text-center md:p-8">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </span>
              {guest?.full_name ? (
                <p className="text-lg font-semibold">{guest.full_name}</p>
              ) : null}
              <p className="text-sm font-medium text-emerald-600">
                {showCountdown
                  ? "Sampai jumpa di Ngunduh Mantu"
                  : "Sudah check-in"}
              </p>
              {showCountdown ? (
                <div className="w-full rounded-2xl bg-wedding-surface/60 p-4">
                  <Countdown />
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
          subTitle={
            showQr
              ? "Tunjukkan tiket ini kepada panitia saat tiba di lokasi acara. Simpan tangkapan layar agar mudah dibuka kembali."
              : isCheckedInAtMantu
                ? "Check-in Pernikahan selesai. QR Ngunduh Mantu akan muncul sesuai tanggalnya."
                : "QR tiket akan muncul pada hari acara. Simpan halaman ini agar mudah dibuka kembali."
          }
        />

        <div className="flex justify-center">
          <Card className="w-full max-w-md items-center gap-4 p-6 text-center md:p-8">
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-wedding-accent">
              {showQr ? detailTitle : title}
            </p>

            {showQr && (
              <div className="rounded-2xl bg-white p-4">
                <QRCodeSVG
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/${guestId}?event=${isUnduhDay ? "unduh" : "mantu"}`
                      : `${guestId}?event=${isUnduhDay ? "unduh" : "mantu"}`
                  }
                  size={200}
                />
              </div>
            )}

            {!showQr && (
              <div className="w-full rounded-2xl bg-wedding-surface/60 p-4">
                <Countdown />
              </div>
            )}
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
