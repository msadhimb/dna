"use client"

import { Button } from "@/components/Button"
import { FormInput } from "@/components/Form/FormInput"
import FormSelect from "@/components/Form/FormSelect"
import { guestFromList } from "@/helper/guestFormList"
import clientApi from "@/services/client"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Html5QrcodeScanner } from "html5-qrcode"
import { Camera, PencilLine, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const manualSchema = yup.object({
  guest: yup.string().required("Tamu wajib dipilih"),
  arrived_count: yup
    .number()
    .typeError("Jumlah datang harus berupa angka")
    .required("Jumlah datang wajib diisi")
    .min(1, "Jumlah datang minimal 1"),
})

type ManualValues = yup.InferType<typeof manualSchema>

// QR berisi id tamu atau URL undangan personal (.../{id}) -> ambil id-nya
const parseGuestId = (text: string) => {
  const trimmed = text.trim().replace(/\/+$/, "")
  const parts = trimmed.split("/")
  return parts[parts.length - 1].trim()
}

const BukuTamu = () => {
  const [mode, setMode] = React.useState<"scan" | "manual">("scan")
  const scannerRef = React.useRef<Html5QrcodeScanner | null>(null)
  const [scannedGuest, setScannedGuest] = React.useState<any | null>(null)
  const [arrived, setArrived] = React.useState<number>(0)
  const [isFetchingGuest, setIsFetchingGuest] = React.useState(false)

  const pauseScanner = React.useCallback(() => {
    try {
      scannerRef.current?.pause()
    } catch {
      // abaikan — scanner mungkin belum running
    }
  }, [])

  const resumeScanner = React.useCallback(() => {
    setScannedGuest(null)
    setArrived(0)
    try {
      scannerRef.current?.resume()
    } catch {
      // abaikan — scanner mungkin belum running
    }
  }, [])

  const handleScanSuccess = React.useCallback(
    async (decodedText: string) => {
      if (scannedGuest || isFetchingGuest) return
      const guestId = parseGuestId(decodedText)
      if (!guestId) {
        toast?.error?.("QR tidak valid")
        return
      }
      pauseScanner()
      setIsFetchingGuest(true)
      try {
        const res = await clientApi({
          url: `/guests/${guestId}`,
          method: "GET",
        })
        const guest = res?.data ?? res
        setScannedGuest(guest)
        setArrived(Number(guest?.guest_total) || 0)
      } catch (err: any) {
        toast?.error?.(
          err?.response?.data?.error || "Tamu tidak ditemukan, coba lagi"
        )
        resumeScanner()
      } finally {
        setIsFetchingGuest(false)
      }
    },
    [isFetchingGuest, pauseScanner, resumeScanner, scannedGuest]
  )

  React.useEffect(() => {
    if (mode !== "scan") return
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )
    scannerRef.current = scanner
    scanner.render(
      (text) => void handleScanSuccess(text),
      () => {}
    )
    return () => {
      scannerRef.current = null
      scanner.clear().catch(() => {})
    }
  }, [mode, handleScanSuccess])

  const { mutate: checkInScanned, isPending: isCheckingIn } = useMutation({
    mutationFn: async () => {
      const res = await clientApi({
        url: `/guests/${scannedGuest.id}/pager-ayu`,
        method: "PATCH",
        data: { arrived_count: Math.trunc(arrived) },
      })
      return res
    },
    onSuccess: (res: any) => {
      const count = res?.data?.checked_in_count ?? res?.checked_in_count ?? arrived
      const name =
        res?.data?.full_name ?? res?.full_name ?? scannedGuest?.full_name ?? ""
      toast?.success?.(
        `Silahkan Masuk${name ? `, ${name}` : ""} (${count} orang)`
      )
      resumeScanner()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ManualValues>({
    resolver: yupResolver(manualSchema),
    defaultValues: {
      guest: "",
      arrived_count: 0,
    },
  })

  const { mutate: checkInManual, isPending: isManualPending } = useMutation({
    mutationFn: async (data: ManualValues) => {
      const res = await clientApi({
        url: `/guests/${data.guest}/pager-ayu`,
        method: "PATCH",
        data: { arrived_count: data.arrived_count },
      })
      return res
    },
    onSuccess: () => {
      toast?.success?.("Silahkan Masuk")
      reset()
    },
    onError: (err: any) => {
      toast?.error?.(err?.response?.data?.error || "Gagal menyimpan data")
    },
  })

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    return clientApi({
      url: "/guests",
      method: "GET",
      params: { page, search },
    })
  }, [])

  const scannedGuestFrom =
    guestFromList.find((x) => x.id === scannedGuest?.guest_from)?.name ??
    (scannedGuest?.guest_from ? String(scannedGuest.guest_from) : "-")

  return (
    <div className="min-h-[80vh]">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Buku Tamu
          </h1>
          <p className="mt-1 text-md text-muted-foreground">
            Arahkan kamera ke QR undangan tamu untuk mencatat kedatangan.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === "scan" ? "default" : "outline"}
            onClick={() => setMode("scan")}
            className="gap-2"
          >
            <Camera className="size-4" />
            Scan QR
          </Button>
          <Button
            variant={mode === "manual" ? "default" : "outline"}
            onClick={() => setMode("manual")}
            className="gap-2"
          >
            <PencilLine className="size-4" />
            Cari Manual
          </Button>
        </div>
      </div>

      {mode === "scan" ? (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-8">
          {!scannedGuest ? (
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div id="qr-reader" className="w-full" />
              <p className="px-4 pb-4 text-center text-sm text-muted-foreground">
                {isFetchingGuest
                  ? "Memeriksa data tamu..."
                  : "Kamera aktif — arahkan ke QR undangan tamu."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-8 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground">Tamu terdeteksi</p>
                <p className="text-2xl font-bold text-foreground">
                  {scannedGuest.full_name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tamu dari: {scannedGuestFrom} • Diundang:{" "}
                  {Number(scannedGuest.guest_total) || 0} orang
                  {scannedGuest.checked_in_at
                    ? ` • Sudah check-in: ${Number(scannedGuest.checked_in_count) || 0} orang`
                    : ""}
                </p>
              </div>
              <NumericFormat
                value={arrived}
                thousandSeparator=","
                allowNegative={false}
                decimalScale={0}
                onValueChange={(values: any) => {
                  setArrived(values.floatValue ?? 0)
                }}
                label="Jumlah Datang"
                customInput={FormInput}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  className={cn("flex-1 gap-2")}
                  onClick={resumeScanner}
                >
                  <RotateCcw className="size-4" />
                  Scan Lagi
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1"
                  disabled={isCheckingIn || !arrived || arrived < 1}
                  onClick={() => checkInScanned()}
                >
                  {isCheckingIn ? "Menyimpan..." : "Konfirmasi Masuk"}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="bg-card border border-border rounded-xl shadow-sm w-2xl flex flex-col gap-8 p-8">
            <div className="flex flex-col gap-5">
              <Controller
                name="guest"
                control={control}
                render={({ field }) => (
                  <FormSelect
                    {...field}
                    label="Tamu"
                    apiConfig={fetchGuests}
                    valueKey="id"
                    labelKey="full_name"
                    resolveEndpoint="/guests"
                    placeholder="Pilih Tamu"
                    error={errors.guest?.message}
                  />
                )}
              />

              <Controller
                name="arrived_count"
                control={control}
                render={({ field }) => (
                  <NumericFormat
                    value={field.value}
                    thousandSeparator=","
                    allowNegative={false}
                    decimalScale={0}
                    onValueChange={(values: any, sourceInfo: any) => {
                      field.onChange(values.floatValue)
                    }}
                    label="Jumlah Datang"
                    customInput={FormInput}
                    error={errors.arrived_count?.message}
                  />
                )}
              />
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleSubmit((data) => checkInManual(data))}
              disabled={isManualPending}
            >
              {isManualPending ? "Menyimpan..." : "Kirim"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BukuTamu
