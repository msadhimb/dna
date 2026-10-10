"use client"

import { Button } from "@/components/Button"
import { Badge } from "@/components/ui/badge"
import { guestFromList } from "@/helper/guestFormList"
import clientApi from "@/services/client"
import React from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Camera, PencilLine } from "lucide-react"
import { CheckedInPanel } from "./components/CheckedInPanel"
import { ManualCheckInForm } from "./components/ManualCheckInForm"
import { ScannedGuestCard } from "./components/ScannedGuestCard"
import { ScannerPanel } from "./components/ScannerPanel"
import { useCheckedInList } from "./hooks/useCheckedInList"
import { useQrScanner } from "./hooks/useQrScanner"
import { parseGuestId } from "./utils"

const BukuTamu = () => {
  const [mode, setMode] = React.useState<"scan" | "manual">("scan")
  const [scannedGuest, setScannedGuest] = React.useState<any | null>(null)
  const [arrived, setArrived] = React.useState<number>(0)
  const [isFetchingGuest, setIsFetchingGuest] = React.useState(false)
  const queryClient = useQueryClient()

  const scanner = useQrScanner({
    enabled: mode === "scan",
    onScan: (text) => void handleScan(text),
  })
  const checkedIn = useCheckedInList()

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
      setArrived(Number(guest?.guest_total) || 1)
    } catch (err: any) {
      toast?.error?.(
        err?.response?.data?.error || "Tamu tidak ditemukan, coba lagi"
      )
      scanner.unlock()
    } finally {
      setIsFetchingGuest(false)
    }
  }

  const handleScanAgain = () => {
    setScannedGuest(null)
    setArrived(0)
    scanner.unlock()
  }

  const { mutate: checkInScanned, isPending: isCheckingIn } = useMutation({
    mutationFn: async () => {
      const res = await clientApi({
        url: `/guests/${scannedGuest.id}/buku-tamu`,
        method: "PATCH",
        data: { arrived_count: Math.trunc(arrived) },
      })
      return res
    },
    onSuccess: (res: any) => {
      const count =
        res?.data?.checked_in_count ?? res?.checked_in_count ?? arrived
      const name =
        res?.data?.full_name ?? res?.full_name ?? scannedGuest?.full_name ?? ""
      toast?.success?.(
        `Silahkan Masuk${name ? `, ${name}` : ""} (${count} orang)`
      )
      queryClient.invalidateQueries({ queryKey: ["guests", "checked-in"] })
      queryClient.invalidateQueries({ queryKey: ["guests"] })
      handleScanAgain()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const scannedGuestFrom =
    guestFromList.find((x) => x.id === scannedGuest?.guest_from)?.name ??
    (scannedGuest?.guest_from ? String(scannedGuest.guest_from) : "-")

  return (
    <div className="font-manrope w-full max-w-full space-y-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-sans text-2xl font-bold tracking-[0.15em] text-foreground uppercase sm:text-3xl sm:tracking-[0.2em]">
            Buku Tamu
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Arahkan kamera belakang ke QR undangan tamu untuk mencatat
            kedatangan.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-3 lg:w-auto">
          <Button
            variant={mode === "scan" ? "default" : "outline"}
            onClick={() => setMode("scan")}
            className="flex w-full items-center justify-center gap-2 hover:cursor-pointer sm:w-auto"
          >
            <Camera className="size-4" />
            Scan QR
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            onClick={() => setMode("manual")}
            className="flex w-full items-center justify-center gap-2 hover:cursor-pointer sm:w-auto"
          >
            <PencilLine className="size-4" />
            Cari Manual
          </Button>
        </div>
      </div>

      {mode === "scan" ? (
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_320px]">
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
                guestFrom={scannedGuestFrom}
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
