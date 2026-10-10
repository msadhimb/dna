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
import { Html5Qrcode } from "html5-qrcode"
import {
  Camera,
  CheckCircle2,
  Flashlight,
  FlashlightOff,
  Minus,
  PencilLine,
  Plus,
  RotateCcw,
  SwitchCamera,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type SimpleCamera = { id: string; label: string }

const manualSchema = yup.object({
  guest: yup.string().required("Tamu wajib dipilih"),
  arrived_count: yup
    .number()
    .typeError("Jumlah datang harus berupa angka")
    .required("Jumlah datang wajib diisi")
    .min(1, "Jumlah datang minimal 1"),
})

type ManualValues = yup.InferType<typeof manualSchema>
type RecentEntry = { name: string; count: number; time: string }

// QR berisi id tamu atau URL undangan personal (.../{id}) -> ambil id-nya
const parseGuestId = (text: string) => {
  const trimmed = text.trim().replace(/\/+$/, "")
  const parts = trimmed.split("/")
  return parts[parts.length - 1].trim()
}

// Kamera belakang biasanya berlabel back/rear; kalau tidak ketahuan, pakai terakhir
const pickRearCameraIndex = (list: SimpleCamera[]) => {
  const idx = list.findIndex((c) =>
    /back|rear|belakang|environment/i.test(c.label)
  )
  return idx >= 0 ? idx : list.length - 1
}

const BukuTamu = () => {
  const [mode, setMode] = React.useState<"scan" | "manual">("scan")
  const qrRef = React.useRef<Html5Qrcode | null>(null)
  const busyRef = React.useRef(false)
  const [cameras, setCameras] = React.useState<SimpleCamera[]>([])
  const [cameraIndex, setCameraIndex] = React.useState(0)
  const [scanning, setScanning] = React.useState(false)
  const [torchOn, setTorchOn] = React.useState(false)
  const [torchSupported, setTorchSupported] = React.useState(false)
  const [scannedGuest, setScannedGuest] = React.useState<any | null>(null)
  const [arrived, setArrived] = React.useState<number>(0)
  const [isFetchingGuest, setIsFetchingGuest] = React.useState(false)
  const [recent, setRecent] = React.useState<RecentEntry[]>([])

  const totalRecentOrang = recent.reduce((s, r) => s + r.count, 0)

  const stopScanner = React.useCallback(async () => {
    const qr = qrRef.current
    qrRef.current = null
    setScanning(false)
    setTorchOn(false)
    setTorchSupported(false)
    if (qr) {
      try {
        await qr.stop()
      } catch {
        // abaikan — mungkin belum running
      }
      try {
        qr.clear()
      } catch {
        // abaikan
      }
    }
  }, [])

  const handleScanSuccess = React.useCallback(
    async (decodedText: string) => {
      if (busyRef.current) return
      const guestId = parseGuestId(decodedText)
      if (!guestId) {
        toast?.error?.("QR tidak valid")
        return
      }
      busyRef.current = true
      try {
        qrRef.current?.pause()
      } catch {
        // abaikan
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
        try {
          qrRef.current?.resume()
        } catch {
          // abaikan
        }
        busyRef.current = false
      } finally {
        setIsFetchingGuest(false)
      }
    },
    []
  )

  const startScanner = React.useCallback(
    async (deviceId?: string) => {
      const el = document.getElementById("qr-viewport")
      if (!el) return
      el.innerHTML = ""
      await stopScanner()
      const qr = new Html5Qrcode("qr-viewport")
      qrRef.current = qr
      // Prioritas: deviceId kamera belakang -> fallback facingMode environment
      const cameraConfig: any = deviceId
        ? deviceId
        : { facingMode: "environment" }
      try {
        await qr.start(
          cameraConfig,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (text) => void handleScanSuccess(text),
          () => {}
        )
        setScanning(true)
        try {
          const caps: any = qr.getRunningTrackCapabilities?.()
          setTorchSupported(Boolean(caps && "torch" in caps))
        } catch {
          setTorchSupported(false)
        }
      } catch {
        toast?.error?.(
          "Kamera tidak dapat diakses. Periksa izin kamera atau pakai mode Cari Manual."
        )
        qrRef.current = null
      }
    },
    [handleScanSuccess, stopScanner]
  )

  // Ambil daftar kamera sekali, default ke kamera belakang
  React.useEffect(() => {
    if (mode !== "scan") return
    let cancelled = false
    Html5Qrcode.getCameras()
      .then((list) => {
        if (cancelled) return
        if (list.length > 0) {
          setCameras(list.map((c: any) => ({ id: c.id, label: c.label })))
          const rear = pickRearCameraIndex(
            list.map((c: any) => ({ id: c.id, label: c.label }))
          )
          setCameraIndex(rear)
          void startScanner(list[rear].id)
        } else {
          void startScanner(undefined)
        }
      })
      .catch(() => {
        if (!cancelled) void startScanner(undefined)
      })
    return () => {
      cancelled = true
    }
  }, [mode])

  // Bersihkan kamera saat pindah mode / unmount
  React.useEffect(() => {
    return () => {
      void stopScanner()
    }
  }, [stopScanner])

  const handleSwitchCamera = () => {
    if (cameras.length < 2) {
      toast?.error?.("Hanya satu kamera yang tersedia")
      return
    }
    const next = (cameraIndex + 1) % cameras.length
    setCameraIndex(next)
    busyRef.current = false
    setScannedGuest(null)
    void startScanner(cameras[next].id)
  }

  const handleScanAgain = () => {
    setScannedGuest(null)
    setArrived(0)
    busyRef.current = false
    try {
      qrRef.current?.resume()
    } catch {
      // abaikan — mulai ulang bila perlu
      const cam = cameras[cameraIndex]
      void startScanner(cam?.id)
    }
  }

  const toggleTorch = async () => {
    const qr = qrRef.current
    if (!qr) return
    try {
      await qr.applyVideoConstraints({ advanced: [{ torch: !torchOn }] } as any)
      setTorchOn((v) => !v)
    } catch {
      toast?.error?.("Flash tidak didukung di perangkat ini")
    }
  }

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
      const count =
        res?.data?.checked_in_count ?? res?.checked_in_count ?? arrived
      const name =
        res?.data?.full_name ?? res?.full_name ?? scannedGuest?.full_name ?? ""
      toast?.success?.(`Silahkan Masuk${name ? `, ${name}` : ""} (${count} orang)`)
      setRecent((prev) =>
        [
          {
            name: name || "Tamu",
            count: Number(count) || 0,
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...prev,
        ].slice(0, 20)
      )
      handleScanAgain()
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
    onSuccess: (res: any, data: ManualValues) => {
      toast?.success?.("Silahkan Masuk")
      setRecent((prev) =>
        [
          {
            name: "Tamu manual",
            count: Number(data.arrived_count) || 0,
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          ...prev,
        ].slice(0, 20)
      )
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
    <div className="font-manrope w-full max-w-full space-y-6">
      <style>{`@keyframes bukutamu-scanline { 0% { top: 6%; } 50% { top: 90%; } 100% { top: 6%; } }`}</style>

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

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
        >
          <span className="text-muted-foreground">Check-in sesi ini:</span>
          <span className="font-medium text-foreground">{recent.length}</span>
        </Badge>
        <Badge
          variant="outline"
          className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
        >
          <span className="text-muted-foreground">Orang masuk:</span>
          <span className="font-medium text-foreground">{totalRecentOrang}</span>
        </Badge>
      </div>

      {mode === "scan" ? (
        <div className="grid w-full gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex min-w-0 flex-col gap-4">
            {!scannedGuest ? (
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                    <span
                      className={cn(
                        "size-2.5 shrink-0 rounded-full",
                        scanning ? "animate-pulse bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    <span className="truncate">
                      {scanning
                        ? `Kamera belakang aktif${cameras[cameraIndex]?.label ? ` • ${cameras[cameraIndex].label}` : ""}`
                        : "Menyiapkan kamera..."}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {torchSupported && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Flash"
                        onClick={toggleTorch}
                      >
                        {torchOn ? (
                          <Flashlight className="size-4" />
                        ) : (
                          <FlashlightOff className="size-4" />
                        )}
                      </Button>
                    )}
                    {cameras.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        title="Ganti kamera"
                        onClick={handleSwitchCamera}
                      >
                        <SwitchCamera className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Viewfinder */}
                <div className="px-4">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                    <div id="qr-viewport" className="w-full" />
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute top-4 left-4 size-8 rounded-tl-lg border-t-2 border-l-2 border-emerald-500" />
                      <div className="absolute top-4 right-4 size-8 rounded-tr-lg border-t-2 border-r-2 border-emerald-500" />
                      <div className="absolute bottom-4 left-4 size-8 rounded-bl-lg border-b-2 border-l-2 border-emerald-500" />
                      <div className="absolute right-4 bottom-4 size-8 rounded-br-lg border-r-2 border-b-2 border-emerald-500" />
                      {scanning && !isFetchingGuest && (
                        <div
                          className="absolute right-8 left-8 h-0.5 rounded-full bg-emerald-500"
                          style={{ animation: "bukutamu-scanline 2.4s ease-in-out infinite" }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <p className="px-4 pt-2 pb-4 text-center text-sm text-muted-foreground">
                  {isFetchingGuest
                    ? "Memeriksa data tamu..."
                    : "Posisikan QR undangan di dalam bingkai."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Tamu terdeteksi
                  </p>
                  <p className="truncate text-2xl font-bold text-foreground">
                    {scannedGuest.full_name}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
                    >
                      <span className="text-muted-foreground">Tamu Dari:</span>
                      <span className="font-medium text-foreground">
                        {scannedGuestFrom}
                      </span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
                    >
                      <span className="text-muted-foreground">Diundang:</span>
                      <span className="font-medium text-foreground">
                        {Number(scannedGuest.guest_total) || 0} orang
                      </span>
                    </Badge>
                    {scannedGuest.checked_in_at ? (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
                      >
                        <span className="text-muted-foreground">Sudah masuk:</span>
                        <span className="font-medium text-foreground">
                          {Number(scannedGuest.checked_in_count) || 0} orang (scan ulang memperbarui)
                        </span>
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
                      >
                        <span className="font-medium text-foreground">
                          Belum check-in
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Jumlah Datang</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-9 shrink-0"
                      onClick={() => setArrived((v) => Math.max(1, (v || 1) - 1))}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <NumericFormat
                      value={arrived}
                      thousandSeparator=","
                      allowNegative={false}
                      decimalScale={0}
                      onValueChange={(values: any) => {
                        setArrived(values.floatValue ?? 0)
                      }}
                      customInput={FormInput}
                      className="text-center font-bold"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="size-9 shrink-0"
                      onClick={() => setArrived((v) => (v || 0) + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 flex-1 gap-1.5"
                    onClick={handleScanAgain}
                  >
                    <RotateCcw className="size-3.5" />
                    Scan Lagi
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 flex-1 gap-1.5"
                    disabled={isCheckingIn || !arrived || arrived < 1}
                    onClick={() => checkInScanned()}
                  >
                    {isCheckingIn ? "Menyimpan..." : `Konfirmasi Masuk (${arrived || 0})`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Riwayat sesi ini */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-4 lg:self-start">
            <p className="text-sm font-medium">
              Baru masuk ({recent.length})
            </p>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada check-in sesi ini. Hasil scan akan muncul di sini.
              </p>
            ) : (
              <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
                {recent.map((r, i) => (
                  <div
                    key={`${r.name}-${r.time}-${i}`}
                    className="flex items-center gap-2.5 rounded-lg border border-muted bg-muted/20 px-3 py-2"
                  >
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.time}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-foreground">
                      +{r.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
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
