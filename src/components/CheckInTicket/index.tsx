import Header from "../Header"
import Card from "../Card"
import { QRCodeSVG } from "qrcode.react"
import { useGuest } from "@/store/useGuest"
import { useCountdown } from "@/hooks/useCountDown"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle2 } from "lucide-react"
import { Countdown } from "../CountDown"
import clientApi from "@/services/client"

type TicketView = "checked-in" | "countdown" | "qr" | "finished"

const CheckInTicket = ({ guestId }: { guestId: string }) => {
  const { guest, setGuest } = useGuest()
  const { title, detailTitle, isEventDay, isUnduhDay, isMantuDay } =
    useCountdown()

  // data polling menang atas data store
  const isCheckedInAtMantu = !!guest?.checked_in_at_mantu
  const isCheckedInAtUnduhMantu = !!guest?.checked_in_at_unduh
  const hasBothStatus = !!(guest?.mantu_status && guest?.unduh_mantu_status)

  const view: TicketView = (() => {
    if (hasBothStatus) {
      if (isMantuDay) {
        if (isCheckedInAtMantu) {
          return "checked-in"
        } else {
          return "qr"
        }
      } else if (isUnduhDay) {
        if (isCheckedInAtUnduhMantu) {
          return "checked-in"
        } else {
          return "qr"
        }
      } else {
        if (isCheckedInAtMantu && isCheckedInAtUnduhMantu) {
          return "finished"
        } else {
          return "countdown"
        }
      }
    }
    return isEventDay ? "qr" : "countdown"
  })()

  const showQr = view === "qr"

  useQuery({
    queryKey: ["guest-status", guestId],
    queryFn: async () => {
      const res = await clientApi({
        url: `/guest-status/${guestId}`,
        method: "GET",
      })

      setGuest({
        ...guest,
        ...res,
      })
      return res
    },
    refetchInterval: 5_000,
    enabled: !!guestId && isEventDay,
    retry: false,
    refetchOnWindowFocus: true,
  })

  if (view === "checked-in") {
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
              "Tiket ini sudah dipindai panitia. Terima kasih atas kehadiran Anda."
            }
          />

          <div className="flex justify-center">
            <Card className="w-full max-w-md items-center gap-2 p-6 text-center md:p-8">
              <span className="flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="size-8 text-emerald-600" />
              </span>
              {guest?.full_name ? (
                <p className="text-sm md:text-md font-semibold font-serif">
                  {guest.full_name}
                </p>
              ) : null}
              <p className="text-sm md:text-md font-medium text-emerald-600 font-serif ">
                Terimakasih sudah meluangkan waktu untuk hadir di acara kami :)
              </p>
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
                <Countdown
                  isVisibleLabel={false}
                  className="dark:text-wedding-accent"
                />
              </div>
            )}
            {showQr ? (
              <p className="text-sm text-wedding-text-secondary font-serif">
                Satu tiket berlaku untuk satu undangan. Panitia akan memindai
                tiket ini pada saat check-in.
              </p>
            ) : (
              <p className="text-sm md:text-md text-muted font-bold font-serif">
                Tiket akan muncul pada hari acara. Simpan halaman ini agar mudah
                dibuka kembali.
              </p>
            )}
          </Card>
        </div>
      </div>
    </section>
  )
}

export default CheckInTicket
