"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import {
  CalendarCheck2,
  Check,
  Clock3,
  Copy,
  Gift,
  Link2,
  MapPin,
  Send,
  TicketCheck,
  Users,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { guestFromList } from "@/helper/guestFormList"
import { cn } from "@/lib/utils"
import SectionLabel from "./components/SectionLabel"
import StatusCard from "./components/StatusCard"
import CheckInRow from "./components/CheckInRow"

type GuestDetailModalProps = {
  guest: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCopyLink: (id: string) => void
}

// Detail satu tamu: seluruh data + QR undangan personal.
export const GuestDetailModal = ({
  guest,
  open,
  onOpenChange,
  onCopyLink,
}: GuestDetailModalProps) => {
  const [copied, setCopied] = useState(false)
  if (!guest && !open) return null

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const link = guest ? `${origin}/${guest.id}` : ""
  const fromName =
    guestFromList.find((g) => g.id === guest?.guest_from)?.name ??
    guest?.guest_from ??
    "-"
  const initial =
    String(guest?.full_name ?? "?")
      .trim()
      .charAt(0)
      .toUpperCase() || "?"
  const checkedAny = !!(
    guest?.checked_in_at_mantu ||
    guest?.checked_in_at_unduh ||
    guest?.checked_in_at
  )
  // Baris check-in mengikuti undangan: tamu mantu-only tidak
  // menampilkan "Ngunduh In", tamu unduh-only tidak menampilkan "Mantu In".
  const showMantu = guest?.mantu_status === true
  const showUnduh = guest?.unduh_mantu_status === true
  const showMantuIn = showMantu || (!showMantu && !showUnduh)
  const showUnduhIn = showUnduh || (!showMantu && !showUnduh)

  const handleCopy = async () => {
    if (!guest) return
    onCopyLink(guest.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[90vh] max-w-[calc(100%-2rem)]! gap-0 overflow-hidden p-0 sm:max-w-lg!">
        {/* Header identitas */}
        <div className="border-b border-wedding-border bg-wedding-surface/70 px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
          <DialogHeader className="flex-row items-center gap-2.5 text-left sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-wedding-border-accent bg-background font-serif text-lg font-bold text-foreground shadow-sm sm:size-12 sm:text-xl">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <DialogTitle className="truncate font-serif text-lg leading-tight sm:text-[22px]">
                {guest?.full_name ?? "Detail Tamu"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-wedding-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
                  <MapPin className="size-3" />
                  {fromName}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-wedding-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted">
                  <Users className="size-3" />
                  {guest?.guest_total ?? 0} tamu
                </span>
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="max-h-[calc(90vh-112px)] space-y-4 overflow-y-auto px-4 py-4 sm:space-y-5 sm:px-5 sm:py-5">
          {/* Tiket + QR */}
          <section className="space-y-2.5">
            <SectionLabel>Tiket Masuk</SectionLabel>
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-wedding-border-accent bg-wedding-surface/60 p-4 text-center sm:p-5">
              <div className="w-full max-w-[192px] rounded-2xl bg-white p-3 shadow-md ring-1 ring-black/5">
                {guest ? (
                  <QRCodeSVG
                    value={link || guest.id}
                    size={168}
                    className="h-auto w-full"
                  />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground">
                Tunjukkan QR ini kepada panitia saat check-in
              </p>
              <div className="flex w-full items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 shadow-xs">
                <Link2 className="size-4 shrink-0 text-muted" />
                <span className="flex-1 truncate text-left font-mono text-xs select-all">
                  {link}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-colors",
                    copied
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                  title="Salin link"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Salin
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Status undangan */}
          <section className="space-y-2.5">
            <SectionLabel>Undangan</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              <StatusCard
                icon={<CalendarCheck2 className="size-4" />}
                label="Mantu"
                value={guest?.mantu_status ? "Diundang" : "Tidak"}
                ok={guest?.mantu_status === true}
              />

              <StatusCard
                icon={<Gift className="size-4" />}
                label="Ngunduh"
                value={guest?.unduh_mantu_status ? "Diundang" : "Tidak"}
                ok={guest?.unduh_mantu_status === true}
              />
              <StatusCard
                icon={<TicketCheck className="size-4" />}
                label="Fisik"
                value={guest?.physical_invitation ? "Ya" : "Tidak"}
                ok={guest?.physical_invitation === true}
              />
              <StatusCard
                icon={<Send className="size-4" />}
                label="WA Terkirim"
                value={guest?.sended ? "Sudah" : "Belum"}
                ok={guest?.sended === true}
              />
            </div>
          </section>

          {/* Kehadiran */}
          <section className="space-y-2.5">
            <SectionLabel>Kehadiran</SectionLabel>
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3",
                checkedAny
                  ? "border-emerald-500/25 bg-emerald-500/[0.07]"
                  : "border-border/70 bg-card/50"
              )}
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border font-serif text-lg font-bold",
                  checkedAny
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                    : "border-border bg-muted/20 text-muted-foreground"
                )}
              >
                {checkedAny ? <Check className="size-5" /> : "–"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                  {checkedAny ? "Sudah check-in" : "Belum check-in"}
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {checkedAny
                    ? `+${Number(guest?.checked_in_count) || 0} orang masuk`
                    : "Belum ada kedatangan tercatat"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {showMantuIn ? (
                <CheckInRow
                  label="Mantu In"
                  iso={guest?.checked_in_at_mantu ?? guest?.checked_in_at}
                  highlight={
                    !!(guest?.checked_in_at_mantu ?? guest?.checked_in_at)
                  }
                />
              ) : null}
              {showUnduhIn ? (
                <CheckInRow
                  label="Ngunduh In"
                  iso={guest?.checked_in_at_unduh}
                  highlight={!!guest?.checked_in_at_unduh}
                />
              ) : null}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
