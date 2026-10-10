"use client"

import { QRCodeSVG } from "qrcode.react"
import Header from "../Header"
import { Card } from "../Card"

const CheckInTicket = ({
  guestId,
  guestName,
}: {
  guestId?: string
  guestName?: string
}) => {
  if (!guestId) return null

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
            {guestName ? (
              <p className="text-lg font-semibold">{guestName}</p>
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
