"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/Button"
import { FormInput } from "@/components/Form/FormInput"
import { FormTextArea } from "@/components/Form/FormTextArea"
import FormSelect from "@/components/Form/FormSelect"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import clientApi from "@/services/client"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function buildDefaultMessage(guest: any, link: string) {
  const guestName = guest?.full_name || "Bapak/Ibu/Saudara/i"
  const isMantu = guest?.mantu_status === true
  const isUnduh = guest?.unduh_mantu_status === true
  let dateStr = "Sabtu, 12 Desember 2026"
  if (isUnduh && isMantu) dateStr = "Sabtu, 12 & 26 Desember 2026"
  else if (isUnduh) dateStr = "Sabtu, 26 Desember 2026"
  else if (isMantu) dateStr = "Sabtu, 12 Desember 2026"

  return `Yth. ${guestName},

Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami:

Devi & Adhim
${dateStr}

Kehadiran dan doa restu Anda sangat berarti bagi kami.

Berikut link undangan personal Anda:
${link}

Mohon maaf apabila undangan ini disampaikan melalui pesan singkat. Atas perhatian dan doa restunya kami ucapkan terima kasih.

Salam hangat,
Devi & Adhim`
}

function normalizeWaNumber(input: string) {
  const digits = input.replace(/\D/g, "")
  if (!digits) return ""
  if (digits.startsWith("0")) return "62" + digits.slice(1)
  if (digits.startsWith("62")) return digits
  return digits
}

const ModalShareWa = ({ open, onOpenChange }: Props) => {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null)
  const [selectedGuestId, setSelectedGuestId] = useState<string>("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

  const link = selectedGuestId ? `${origin}/${selectedGuestId}` : ""

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    return clientApi({
      url: "/guests",
      method: "GET",
      params: { page, search, pageSize: 20 },
    })
  }, [])

  // Reset semua form ketika modal di-close
  useEffect(() => {
    if (!open) {
      setSelectedGuest(null)
      setSelectedGuestId("")
      setPhone("")
      setMessage("")
    }
  }, [open])

  useEffect(() => {
    if (selectedGuest && link) {
      setMessage(buildDefaultMessage(selectedGuest, link))
    } else if (!selectedGuest) {
      setMessage("")
    }
  }, [selectedGuest, link])

  const handleShare = () => {
    if (!selectedGuestId || !selectedGuest) {
      toast.error("Pilih tamu terlebih dahulu")
      return
    }
    let finalMessage = message.trim()
    if (!finalMessage.includes(link)) {
      finalMessage = `${finalMessage}\n\n${link}`
    }
    if (!finalMessage) {
      toast.error("Pesan tidak boleh kosong")
      return
    }
    const encoded = encodeURIComponent(finalMessage)
    const cleanPhone = normalizeWaNumber(phone)
    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`
    window.open(waUrl, "_blank", "noopener,noreferrer")
    toast.success(
      cleanPhone
        ? `Membuka chat ${selectedGuest.full_name}…`
        : "Membuka WhatsApp…"
    )
    onOpenChange(false)
  }

  const handleResetTemplate = () => {
    if (!selectedGuest || !link) {
      toast.error("Pilih tamu terlebih dahulu")
      return
    }
    setMessage(buildDefaultMessage(selectedGuest, link))
    toast.info("Template dikembalikan ke default")
  }

  const handleGuestChange = (value: string, data: any) => {
    setSelectedGuestId(value)
    if (data) {
      setSelectedGuest(data)
    } else {
      setSelectedGuest(null)
    }
  }

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      // keep guest? reset?
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="font-manrope w-[90vw] md:w-2xl max-h-[90vh] flex flex-col justify-center gap-0 p-0 overflow-hidden bg-card border border-border shadow-wedding-card">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0 border-b border-border bg-muted/20">
          <DialogTitle className="flex items-center gap-3 text-lg font-bold text-foreground">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#25D366]/10 border border-[#25D366]/20">
              <FaWhatsapp className="size-5 text-[#25D366]" />
            </span>
            Share ke WhatsApp
          </DialogTitle>
          <DialogDescription className="text-sm text-left text-muted-foreground leading-relaxed">
            Pilih tamu, masukkan nomor WhatsApp tujuan, dan edit ucapan sebelum
            dibagikan. Link undangan akan otomatis ditambahkan jika belum ada.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] px-6 py-5 space-y-5">
          {/* Pilih Tamu - pakai FormSelect */}
          <FormSelect
            label="Pilih Tamu"
            placeholder="Cari & pilih tamu..."
            value={selectedGuestId}
            onChange={handleGuestChange}
            apiConfig={fetchGuests}
            valueKey="id"
            labelKey="full_name"
            resolveEndpoint="/guests"
            error={!selectedGuestId && message ? undefined : undefined}
          />

          {/* Nomor WA - FormInput */}
          <div className="space-y-1">
            <FormInput
              label="Nomor WhatsApp Tujuan"
              placeholder="08xxxxxxxxxx (kosongkan untuk pilih kontak)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-[11px] leading-relaxed text-muted-foreground px-1">
              {phone.trim()
                ? `Akan dibuka direct chat ke ${normalizeWaNumber(phone) || phone}. Kosongkan untuk picker kontak WhatsApp.`
                : "Kosongkan jika ingin memilih kontak manual di WhatsApp."}
            </p>
          </div>

          {/* Pesan - FormTextArea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.30em] uppercase text-wedding-text-secondary">
                Pesan Undangan
              </span>
              <button
                type="button"
                onClick={handleResetTemplate}
                disabled={!selectedGuest}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset template
              </button>
            </div>
            <FormTextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                selectedGuest
                  ? "Tulis ucapan..."
                  : "Pilih tamu terlebih dahulu untuk generate template..."
              }
              disabled={!selectedGuest}
              className="min-h-[220px] leading-relaxed"
              rows={10}
            />
            {link && (
              <p className="text-[11px] text-muted-foreground">
                Link undangan{" "}
                <span className="font-mono text-foreground break-all">
                  {link}
                </span>{" "}
                akan otomatis ditambahkan jika belum ada di pesan.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="bg-muted/30 border-t border-border flex flex-col-reverse sm:flex-row items-center gap-2 px-6 py-4 m-0! mx-0! mb-0!">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="hover:cursor-pointer sm:min-w-22.5"
          >
            Batal
          </Button>
          <Button
            onClick={handleShare}
            disabled={!selectedGuest || !message.trim()}
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent sm:min-w-35 justify-center disabled:opacity-50"
          >
            <FaWhatsapp className="size-4 shrink-0" />
            Share ke WA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalShareWa
