"use client"

import { Html5Qrcode } from "html5-qrcode"
import { toast } from "sonner"
import { pickRearCameraIndex, type SimpleCamera } from "../utils"
import { useEffect, useRef, useState, useCallback } from "react"

type UseQrScannerOptions = {
  enabled: boolean
  onScan: (text: string) => void
}

// Seluruh lifecycle kamera belakang: enumerasi, start/stop, torch, ganti kamera.
export const useQrScanner = ({ enabled, onScan }: UseQrScannerOptions) => {
  const qrRef = useRef<Html5Qrcode | null>(null)
  const lockedRef = useRef(false)
  const onScanRef = useRef(onScan)
  onScanRef.current = onScan

  const [cameras, setCameras] = useState<SimpleCamera[]>([])
  const [cameraIndex, setCameraIndex] = useState(0)
  const [scanning, setScanning] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [torchSupported, setTorchSupported] = useState(false)

  const stop = useCallback(async () => {
    const qr = qrRef.current
    qrRef.current = null
    setScanning(false)
    setTorchOn(false)
    setTorchSupported(false)
    if (!qr) return
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
  }, [])

  const pause = useCallback(() => {
    try {
      qrRef.current?.pause()
    } catch {
      // abaikan
    }
  }, [])

  const resume = useCallback(() => {
    try {
      qrRef.current?.resume()
    } catch {
      // abaikan
    }
  }, [])

  const lock = useCallback(() => {
    lockedRef.current = true
    pause()
  }, [pause])

  const unlock = useCallback(() => {
    lockedRef.current = false
    resume()
  }, [resume])

  const start = useCallback(
    async (deviceId?: string) => {
      const el = document.getElementById("qr-viewport")
      if (!el) return
      el.innerHTML = ""
      await stop()
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
          (text) => {
            if (lockedRef.current) return
            lockedRef.current = true
            pause()
            onScanRef.current(text)
          },
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
    [pause, stop]
  )

  // Ambil daftar kamera sekali saat mode scan aktif, default ke kamera belakang
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    Html5Qrcode.getCameras()
      .then((list) => {
        if (cancelled) return
        if (list.length > 0) {
          const mapped = list.map((c: any) => ({ id: c.id, label: c.label }))
          setCameras(mapped)
          const rear = pickRearCameraIndex(mapped)
          setCameraIndex(rear)
          void start(list[rear].id)
        } else {
          void start(undefined)
        }
      })
      .catch(() => {
        if (!cancelled) void start(undefined)
      })
    return () => {
      cancelled = true
    }
  }, [enabled, start])

  // Bersihkan kamera saat unmount
  useEffect(() => {
    return () => {
      void stop()
    }
  }, [stop])

  const switchCamera = useCallback(() => {
    if (cameras.length < 2) {
      toast?.error?.("Hanya satu kamera yang tersedia")
      return
    }
    const next = (cameraIndex + 1) % cameras.length
    setCameraIndex(next)
    lockedRef.current = false
    void start(cameras[next].id)
  }, [cameraIndex, cameras, start])

  const toggleTorch = useCallback(async () => {
    const qr = qrRef.current
    if (!qr) return
    try {
      await qr.applyVideoConstraints({
        advanced: [{ torch: !torchOn }],
      } as any)
      setTorchOn((v) => !v)
    } catch {
      toast?.error?.("Flash tidak didukung di perangkat ini")
    }
  }, [torchOn])

  return {
    cameras,
    cameraLabel: cameras[cameraIndex]?.label ?? "",
    scanning,
    torchOn,
    torchSupported,
    switchCamera,
    toggleTorch,
    lock,
    unlock,
    pause,
    resume,
    restart: start,
  }
}
