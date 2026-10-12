"use client"

import Card from "@/components/Card"
import { BookOpenText, CheckCircle2 } from "lucide-react"
import { latestCheckInAt } from "@/helper/eventSchedule"
import { formatCheckInTime } from "../utils"

type CheckedInPanelProps = {
  guests: any[]
  total: number
  isPending: boolean
  isError: boolean
}

// 5 tamu terbaru yang sudah check-in (data server — tahan refresh).
export const CheckedInPanel = ({ guests, total, isPending, isError }: CheckedInPanelProps) => {
  return (
    <Card className="gap-3 p-5 lg:sticky lg:top-20 lg:self-start">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
          <BookOpenText className="size-4" />
        </span>
        <div>
          <p className="font-serif text-base font-semibold text-foreground">
            Sudah check-in
          </p>
          <p className="text-xs text-muted-foreground">
            {total.toLocaleString("id-ID")} undangan tercatat
          </p>
        </div>
      </div>

      {isPending ? (
        <p className="animate-pulse text-sm text-muted-foreground">Memuat...</p>
      ) : isError ? (
        <p className="text-sm text-muted-foreground">
          Gagal memuat daftar. Coba muat ulang halaman.
        </p>
      ) : guests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-wedding-border bg-wedding-surface/60 p-4 text-center">
          <p className="font-signature text-2xl text-muted">Belum ada tamu</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Hasil scan akan muncul di sini otomatis.
          </p>
        </div>
      ) : (
        <div className="flex max-h-96 flex-col gap-1.5 overflow-y-auto">
          {guests.map((guest: any) => (
            <div
              key={guest.id}
              className="flex items-center gap-2.5 rounded-xl border border-transparent px-3 py-2 transition-colors hover:border-wedding-border hover:bg-wedding-surface/70"
            >
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[15px] font-semibold text-foreground">
                  {guest.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Masuk pukul {formatCheckInTime(latestCheckInAt(guest))}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                +{Number(guest.checked_in_count) || 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
