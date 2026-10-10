"use client"

import Card from "@/components/Card"
import { CheckCircle2 } from "lucide-react"
import { formatCheckInTime } from "../utils"

type CheckedInPanelProps = {
  guests: any[]
  total: number
  isPending: boolean
  isError: boolean
}

// 5 tamu terbaru yang sudah check-in (data server — tahan refresh).
export const CheckedInPanel = ({
  guests,
  total,
  isPending,
  isError,
}: CheckedInPanelProps) => {
  return (
    <Card className="flex flex-col gap-3 rounded-xl p-5 shadow-sm lg:sticky lg:top-4 lg:self-start">
      <p className="text-sm font-medium">Sudah check-in ({total})</p>
      {isPending ? (
        <p className="text-sm text-muted-foreground">Memuat...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Gagal memuat daftar. Coba muat ulang halaman.
        </p>
      ) : guests.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Belum ada tamu check-in. Hasil scan akan muncul di sini.
        </p>
      ) : (
        <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
          {guests.map((guest: any) => (
            <div
              key={guest.id}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {guest.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCheckInTime(guest.checked_in_at)}
                </p>
              </div>
              <span className="shrink-0 text-xs font-bold text-foreground">
                +{Number(guest.checked_in_count) || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
