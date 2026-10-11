"use client"

import React from "react"
import GuestFormModal from "@/components/GuestFormModal"
import AdminPageHeader from "@/components/AdminPageHeader"
import AdminStatCard from "@/components/AdminStatCard"
import Card from "@/components/Card"
import {
  BookOpenText,
  Link2,
  MessagesSquare,
  Send,
  UsersRound,
} from "lucide-react"
import { useDashboardStats } from "./hooks/useDashboardStats"
import { DashboardShortcuts } from "./components/DashboardShortcuts"

// Dashboard = Dashboard + ringkasan + pintasan, satu layar rapi.
const DashboardView = () => {
  const stats = useDashboardStats()

  const fmt = (n: number) => (stats.isLoading ? "…" : n.toLocaleString("id-ID"))

  return (
    <div className="w-full max-w-full space-y-6 font-manrope">
      <AdminPageHeader
        title="Dashboard"
        description="Buat link undangan personal untuk setiap tamu, lalu pantau progres undangan dari sini."
      />

      <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon={<UsersRound className="size-5" />}
          label="Total Tamu"
          value={fmt(stats.totalGuests)}
          hint="Undangan terdaftar"
        />
        <AdminStatCard
          icon={<Send className="size-5" />}
          label="WA Terkirim"
          value={fmt(stats.totalSended)}
          hint="Sudah dibagikan"
          accent="#25D366"
        />
        <AdminStatCard
          icon={<BookOpenText className="size-5" />}
          label="Check-In"
          value={fmt(stats.totalCheckedIn)}
          hint="Hadir di acara"
          accent="#16a34a"
        />
        <AdminStatCard
          icon={<MessagesSquare className="size-5" />}
          label="Ucapan"
          value={fmt(stats.totalComments)}
          hint="Doa & harapan"
          accent="#D4AF37"
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_320px]">
        <Card className="gap-0 overflow-hidden p-0">
          <div className="flex items-center gap-3 border-b border-wedding-border bg-wedding-surface/60 px-6 py-4 sm:px-8">
            <span className="flex size-10 items-center justify-center rounded-full border border-book-ornament/40 bg-book-ornament/10 text-book-ornament dark:text-book-cover-title">
              <Link2 className="size-4" />
            </span>
            <div>
              <p className="font-serif text-lg font-semibold text-foreground">
                Buat Undangan Baru
              </p>
              <p className="text-xs text-muted-foreground">
                Link personal langsung jadi setelah nama disimpan.
              </p>
            </div>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-7">
            <GuestFormModal isModal={false} mode="create" hideHeader />
          </div>
        </Card>

        <div className="flex flex-col gap-4 lg:sticky lg:top-20">
          <Card className="p-5">
            <p className="text-[11px] font-bold tracking-[0.24em] text-muted uppercase">
              Pintasan Panitia
            </p>
            <div className="mt-3">
              <DashboardShortcuts />
            </div>
          </Card>
          <Card withCorners={false} className="p-5">
            <p className="font-signature text-2xl leading-none text-muted">
              Tips panitia
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-muted-foreground">
              <li>Import Excel untuk puluhan nama sekaligus.</li>
              <li>Tandai “WA Terkirim” setelah membagikan link.</li>
              <li>Saat acara, gunakan Buku Tamu + Scan QR.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardView
