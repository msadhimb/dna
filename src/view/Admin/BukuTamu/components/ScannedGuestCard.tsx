"use client"

import { Button } from "@/components/Button"
import Card from "@/components/Card"
import { FormInput } from "@/components/Form/FormInput"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, RotateCcw } from "lucide-react"
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
  return (
    <Card className="flex flex-col gap-8 p-5">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">
          Tamu terdeteksi
        </p>
        <p className="truncate text-2xl font-bold text-foreground">
          {guest?.full_name}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className="bg-muted-foreground p-3 text-white">
            {guestFrom}
          </Badge>
          {guest?.checked_in_at ? (
            <Badge className="bg-muted-foreground p-3 text-white">
              {Number(guest.checked_in_count) || 0} orang (scan ulang
              memperbarui)
            </Badge>
          ) : (
            <Badge className="bg-muted-foreground p-3 text-white">
              Belum check-in
            </Badge>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Jumlah Datang</p>
        <div className="flex items-center justify-center gap-3 md:justify-start">
          <Button
            variant="outline"
            size="sm"
            className="size-9 shrink-0"
            onClick={() => onArrivedChange(Math.max(1, (arrived || 1) - 1))}
          >
            <Minus className="size-4" />
          </Button>
          <NumericFormat
            value={arrived}
            thousandSeparator=","
            allowNegative={false}
            decimalScale={0}
            onValueChange={(values: any) => {
              onArrivedChange(values.floatValue ?? 0)
            }}
            customInput={FormInput}
            className="text-center font-bold"
          />
          <Button
            variant="outline"
            size="sm"
            className="size-9 shrink-0"
            onClick={() => onArrivedChange((arrived || 0) + 1)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onScanAgain}
        >
          <RotateCcw className="size-3.5" />
          Scan Lagi
        </Button>
        <Button
          size="sm"
          className="w-full"
          disabled={isConfirming || !arrived || arrived < 1}
          onClick={onConfirm}
        >
          {isConfirming ? "Menyimpan..." : `Konfirmasi Masuk (${arrived || 0})`}
        </Button>
      </div>
    </Card>
  )
}
