"use client"

import { Button } from "@/components/Button"
import Card from "@/components/Card"
import { FormInput } from "@/components/Form/FormInput"
import { Badge } from "@/components/ui/badge"
import { Check, Minus, Plus, RotateCcw } from "lucide-react"
import { NumericFormat } from "react-number-format"

type ScannedGuestCardProps = {
  guest: any
  guestFrom: string
  arrived: number
  isConfirming: boolean
  onArrivedChange: (value: number) => void
  onScanAgain: () => void
  onConfirm: () => void
}

// Kartu konfirmasi tamu hasil scan + stepper jumlah datang.
export const ScannedGuestCard = ({
  guest,
  guestFrom,
  arrived,
  isConfirming,
  onArrivedChange,
  onScanAgain,
  onConfirm,
}: ScannedGuestCardProps) => {
  const checkedIn = !!guest?.checked_in_at
  return (
    <Card className="gap-6 p-5 sm:p-6">
      <div className="min-w-0">
        <p className="text-[11px] font-bold tracking-[0.24em] text-muted uppercase">
          Tamu terdeteksi
        </p>
        <p className="mt-1 truncate font-serif text-3xl font-semibold text-foreground">
          {guest?.full_name}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-wedding-border bg-wedding-surface px-3 py-1 text-muted">
            {guestFrom}
          </Badge>
          {checkedIn ? (
            <Badge className="border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-600">
              <Check className="size-3.5" />
              Sudah masuk • +{Number(guest.checked_in_count) || 0}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-book-ornament/40 bg-book-ornament/10 px-3 py-1 text-book-ornament dark:text-book-cover-title">
              Belum check-in
            </Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-wedding-border bg-wedding-surface/60 p-4">
        <p className="text-center text-[11px] font-bold tracking-[0.24em] text-muted uppercase">
          Jumlah datang
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            aria-label="Kurangi"
            className="size-10 shrink-0 rounded-full"
            onClick={() => onArrivedChange(Math.max(1, (arrived || 1) - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <NumericFormat
            value={arrived}
            thousandSeparator=","
            allowNegative={false}
            decimalScale={0}
            onValueChange={(values: any) => onArrivedChange(values.floatValue ?? 0)}
            customInput={FormInput}
            className="max-w-28 text-center font-serif text-2xl font-bold"
          />
          <Button
            variant="outline"
            size="sm"
            aria-label="Tambah"
            className="size-10 shrink-0 rounded-full"
            onClick={() => onArrivedChange((arrived || 0) + 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {checkedIn && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Scan ulang akan memperbarui jumlah kedatangan.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="w-full rounded-xl" onClick={onScanAgain}>
          <RotateCcw className="size-4" />
          Scan Lagi
        </Button>
        <Button
          className="w-full rounded-xl"
          disabled={isConfirming || !arrived || arrived < 1}
          onClick={onConfirm}
        >
          {isConfirming ? "Menyimpan..." : `Konfirmasi Masuk (${arrived || 0})`}
        </Button>
      </div>
    </Card>
  )
}
