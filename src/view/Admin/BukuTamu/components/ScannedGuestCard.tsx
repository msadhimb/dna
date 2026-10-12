"use client"

import { Button } from "@/components/Button"
import Card from "@/components/Card"
import { Badge } from "@/components/ui/badge"
import { Check, RotateCcw, Users } from "lucide-react"

type ScannedGuestCardProps = {
  guest: any
  guestFrom: string
  isConfirming: boolean
  activeEvent: "mantu" | "unduh"
  onScanAgain: () => void
  onConfirm: () => void
}

// Kartu konfirmasi tamu hasil scan. Satu tamu scan sekali per acara:
// jumlah rombongan otomatis = guest_total, tanpa input manual.
export const ScannedGuestCard = ({
  guest,
  guestFrom,
  isConfirming,
  activeEvent,
  onScanAgain,
  onConfirm,
}: ScannedGuestCardProps) => {
  const mantuChecked = !!(
    guest?.checked_in_at_mantu ?? guest?.checked_in_at
  )
  const unduhChecked = !!guest?.checked_in_at_unduh
  const checkedIn = activeEvent === "mantu" ? mantuChecked : unduhChecked
  const eventLabel = activeEvent === "mantu" ? "Mantu" : "Ngunduh Mantu"
  const partySize = Number(guest?.guest_total) || 0

  return (
    <Card className="gap-6 p-5 sm:p-6">
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-[0.24em] text-muted uppercase">
          Tamu terdeteksi • {eventLabel}
        </p>
        <p className="mt-1 truncate font-serif text-3xl font-semibold text-foreground">
          {guest?.full_name}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-wedding-border bg-wedding-surface px-3 py-1 text-muted">
            {guestFrom}
          </Badge>
          <Badge
            variant="outline"
            className={
              mantuChecked
                ? "border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600"
                : "border-border px-3 py-1 text-muted-foreground"
            }
          >
            {mantuChecked ? (
              <>
                <Check className="size-3.5" /> Mantu masuk
              </>
            ) : (
              "Mantu belum"
            )}
          </Badge>
          <Badge
            variant="outline"
            className={
              unduhChecked
                ? "border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600"
                : "border-border px-3 py-1 text-muted-foreground"
            }
          >
            {unduhChecked ? (
              <>
                <Check className="size-3.5" /> Ngunduh masuk
              </>
            ) : (
              "Ngunduh belum"
            )}
          </Badge>
          {checkedIn ? (
            <Badge className="border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600">
              <Check className="size-3.5" />
              {eventLabel} sudah masuk
            </Badge>
          ) : (
            <Badge variant="outline" className="border-book-ornament/40 bg-book-ornament/10 px-3 py-1 text-book-ornament dark:text-book-cover-title">
              {eventLabel} belum check-in
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5 rounded-2xl border border-wedding-border bg-wedding-surface/60 px-4 py-4">
        <Users className="size-5 shrink-0 text-muted" />
        <p className="text-sm text-muted-foreground">
          Rombongan{" "}
          <span className="font-serif text-xl font-bold text-foreground">
            {partySize}
          </span>{" "}
          orang • sesuai undangan
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="w-full rounded-xl" onClick={onScanAgain}>
          <RotateCcw className="size-4" />
          Scan Lagi
        </Button>
        <Button
          className="w-full rounded-xl"
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {isConfirming ? "Menyimpan..." : `Konfirmasi ${eventLabel}`}
        </Button>
      </div>
    </Card>
  )
}
