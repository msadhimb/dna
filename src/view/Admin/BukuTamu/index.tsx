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
import { parseGuestId } from "./utils"

type Mode = "scan" | "manual"

// Buku Tamu: scan QR / cari manual + panel tamu hadir, gaya undangan.
const BukuTamu = () => {
  const [mode, setMode] = React.useState<Mode>("scan")
  const [scannedGuest, setScannedGuest] = React.useState<any | null>(null)
  const [arrived, setArrived] = React.useState(1)
  const [isFetchingGuest, setIsFetchingGuest] = React.useState(false)
  const queryClient = useQueryClient()
  const checkedIn = useCheckedInList()

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
      // Utamakan jumlah aktual yang sudah tercatat (scan ulang),
      // baru jatah undangan sebagai default check-in pertama.
      setArrived(
        Number(guest?.checked_in_count) || Number(guest?.guest_total) || 1
      )
    } catch (err: any) {
      toast?.error?.(err?.response?.data?.error || "Tamu tidak ditemukan, coba lagi")
      scanner.unlock()
    } finally {
      setIsFetchingGuest(false)
    }
  }

  const handleScanAgain = () => {
    setScannedGuest(null)
    setArrived(1)
    scanner.unlock()
  }

  const { mutate: checkInScanned, isPending: isCheckingIn } = useMutation({
    mutationFn: async () =>
      clientApi({
        url: `/guests/${scannedGuest.id}/buku-tamu`,
        method: "PATCH",
        data: { arrived_count: Math.trunc(arrived) },
      }),
    onSuccess: (res: any) => {
      const count = res?.data?.checked_in_count ?? res?.checked_in_count ?? arrived
      const name = res?.data?.full_name ?? res?.full_name ?? scannedGuest?.full_name ?? ""
      toast?.success?.(`Silakan masuk${name ? `, ${name}` : ""} (${count} orang)`)
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
        description="Arahkan kamera ke QR undangan untuk mencatat kedatangan, atau cari nama secara manual."
        actions={
          <AdminSegmentedControl<Mode>
            value={mode}
            onChange={setMode}
            options={[
              { value: "scan", label: "Scan QR", icon: <Camera className="size-4" /> },
              { value: "manual", label: "Cari Manual", icon: <PencilLine className="size-4" /> },
            ]}
          />
        }
      />

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
        <AdminStatCard
          icon={<UsersRound className="size-5" />}
          label="Undangan Hadir"
          value={(checkedIn.totalGuests ?? 0).toLocaleString("id-ID")}
          hint="Tamu sudah check-in"
        />
        <AdminStatCard
          icon={<UserCheck className="size-5" />}
          label="Jiwa Hadir"
          value={(checkedIn.totalPeople ?? 0).toLocaleString("id-ID")}
          hint="Total orang masuk"
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
              />
            ) : (
              <ScannedGuestCard
                guest={scannedGuest}
                guestFrom={scannedFrom}
                arrived={arrived}
                isConfirming={isCheckingIn}
                onArrivedChange={setArrived}
                onScanAgain={handleScanAgain}
                onConfirm={() => checkInScanned()}
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
        <ManualCheckInForm />
      )}
    </div>
  )
}

export default BukuTamu
