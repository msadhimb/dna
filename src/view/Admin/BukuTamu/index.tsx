"use client"

import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Camera, PencilLine, UsersRound, UserCheck } from "lucide-react"
import { guestFromList } from "@/helper/guestFormList"
import clientApi from "@/services/client"
import AdminPageHeader from "@/components/AdminPageHeader"
import AdminSegmentedControl from "@/components/AdminSegmentedControl"
import AdminStatCard from "@/components/AdminStatCard"
import { CheckedInPanel } from "./components/CheckedInPanel"
import { ManualCheckInForm } from "./components/ManualCheckInForm"
import { ScannedGuestCard } from "./components/ScannedGuestCard"
import { ScannerPanel } from "./components/ScannerPanel"
import { useCheckedInList } from "./hooks/useCheckedInList"
import { useQrScanner } from "./hooks/useQrScanner"
import { autoCheckInEvent } from "@/helper/eventSchedule"
import { parseGuestId } from "./utils"

type Mode = "scan" | "manual"

// Buku Tamu: scan QR / cari manual + panel tamu hadir, gaya undangan.
// Event check-in otomatis mengikuti tanggal (tanpa filter manual):
// sebelum 12 Des 2026 = mantu, sesudahnya = unduh. Statistik reset
// saat tanggal unduh tiba dan hanya menghitung check-in unduh.
const BukuTamu = () => {
  const [mode, setMode] = React.useState<Mode>("scan")
  // useState agar event terkunci per sesi panitia (tidak flip tiba-tiba
  // tepat tengah malam saat halaman terbuka).
  const [checkInEvent] = React.useState(autoCheckInEvent)
  const [scannedGuest, setScannedGuest] = React.useState<any | null>(null)
  const [isFetchingGuest, setIsFetchingGuest] = React.useState(false)
  const queryClient = useQueryClient()
  const checkedIn = useCheckedInList(checkInEvent)
  const eventLabel = checkInEvent === "mantu" ? "Mantu • 12 Des" : "Ngunduh • 26 Des"

  const scanner = useQrScanner({
    enabled: mode === "scan",
    onScan: (text) => void handleScan(text),
  })

  async function handleScan(decodedText: string) {
    const guestId = parseGuestId(decodedText)
    if (!guestId) {
      toast?.error?.("QR tidak valid")
      scanner.unlock()
      return
    }
    setIsFetchingGuest(true)
    try {
      const res = await clientApi({ url: `/guests/${guestId}`, method: "GET" })
      const guest = res?.data ?? res
      setScannedGuest(guest)
    } catch (err: any) {
      toast?.error?.(err?.response?.data?.error || "Tamu tidak ditemukan, coba lagi")
      scanner.unlock()
    } finally {
      setIsFetchingGuest(false)
    }
  }

  const handleScanAgain = () => {
    setScannedGuest(null)
    // Kamera dihidupkan ulang oleh ScannerPanel saat di-mount ulang
    // (onViewportReady) — unlock/resume saja tidak cukup karena
    // #qr-viewport ikut di-unmount saat kartu hasil scan tampil.
  }

  const { mutate: checkInScanned, isPending: isCheckingIn } = useMutation({
    // Satu tamu scan sekali per acara. Jika guest_total masih 0 (belum
    // diketahui), isi dulu dari input panitia baru catat check-in.
    mutationFn: async (partySize?: number) => {
      const g = scannedGuest
      if (!g) throw new Error("Tamu belum dipilih")
      if ((Number(g?.guest_total) || 0) <= 0) {
        const n = Math.trunc(Number(partySize) || 0)
        if (!n || n < 1) throw new Error("Isi jumlah rombongan dulu")
        await clientApi({
          url: `/guests/${g.id}`,
          method: "PATCH",
          data: { guest_total: n },
        })
      }
      return clientApi({
        url: `/guests/${g.id}/buku-tamu`,
        method: "PATCH",
        data: { event: checkInEvent },
      })
    },
    onSuccess: (res: any) => {
      const name = res?.data?.full_name ?? res?.full_name ?? scannedGuest?.full_name ?? ""
      const total = Number(res?.data?.guest_total ?? res?.guest_total ?? scannedGuest?.guest_total) || 0
      toast?.success?.(`Silakan masuk${name ? `, ${name}` : ""}${total ? ` (${total} orang)` : ""}`)
      queryClient.invalidateQueries({ queryKey: ["guests", "checked-in"] })
      queryClient.invalidateQueries({ queryKey: ["guests"] })
      handleScanAgain()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const scannedFrom =
    guestFromList.find((x) => x.id === scannedGuest?.guest_from)?.name ??
    (scannedGuest?.guest_from ? String(scannedGuest.guest_from) : "-")

  return (
    <div className="w-full max-w-full space-y-6 font-manrope">
      <AdminPageHeader
        title="Buku Tamu"
        description={`Arahkan kamera ke QR undangan untuk mencatat kedatangan, atau cari nama secara manual. Mode check-in otomatis: ${eventLabel}.`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-book-ornament/40 bg-book-ornament/10 px-3 text-sm font-semibold text-book-ornament dark:text-book-cover-title">
              {eventLabel}
            </span>
            <AdminSegmentedControl<Mode>
              value={mode}
              onChange={setMode}
              options={[
                { value: "scan", label: "Scan QR", icon: <Camera className="size-4" /> },
                { value: "manual", label: "Cari Manual", icon: <PencilLine className="size-4" /> },
              ]}
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <AdminStatCard
          icon={<UsersRound className="size-5" />}
          label="Undangan Hadir"
          value={(checkedIn.totalGuests ?? 0).toLocaleString("id-ID")}
          hint={`Check-in ${checkInEvent === "mantu" ? "mantu" : "ngunduh mantu"}`}
        />
        <AdminStatCard
          icon={<UserCheck className="size-5" />}
          label="Jiwa Hadir"
          value={(checkedIn.totalPeople ?? 0).toLocaleString("id-ID")}
          hint={`Orang masuk ${checkInEvent === "mantu" ? "mantu" : "ngunduh mantu"}`}
          accent="#16a34a"
        />
      </div>

      {mode === "scan" ? (
        <div className="grid w-full items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {!scannedGuest ? (
              <ScannerPanel
                scanning={scanner.scanning}
                cameraLabel={scanner.cameraLabel}
                torchSupported={scanner.torchSupported}
                torchOn={scanner.torchOn}
                showSwitchCamera={scanner.cameras.length > 1}
                isFetchingGuest={isFetchingGuest}
                onToggleTorch={() => void scanner.toggleTorch()}
                onSwitchCamera={scanner.switchCamera}
                onViewportReady={() => scanner.restartCurrent()}
              />
            ) : (
              <ScannedGuestCard
                guest={scannedGuest}
                guestFrom={scannedFrom}
                isConfirming={isCheckingIn}
                activeEvent={checkInEvent}
                onScanAgain={handleScanAgain}
                onConfirm={(partySize) => checkInScanned(partySize)}
              />
            )}
          </div>
          <CheckedInPanel
            guests={checkedIn.guests}
            total={checkedIn.totalGuests}
            isPending={checkedIn.isPending}
            isError={checkedIn.isError}
          />
        </div>
      ) : (
        <ManualCheckInForm activeEvent={checkInEvent} />
      )}
    </div>
  )
}

export default BukuTamu
