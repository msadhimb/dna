"use client"

import Image from "next/image"
import { useState } from "react"
import { Download, QrCode } from "lucide-react"
import { Button } from "@/components/Button"

interface QrisCardProps {
  qrisUrl: string
  qrisName?: string
  accent: string
  borderAccent: string
  isDark: boolean
  surface?: string
}

const QrisCard = ({
  qrisUrl,
  qrisName = "Devi & Adhim",
  accent,
  borderAccent,
  isDark,
  surface,
}: QrisCardProps) => {
  const bg = surface ?? (isDark ? "#0A0A0A" : "#F8F8F8")
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!qrisUrl) return
    try {
      setDownloading(true)
      const res = await fetch(qrisUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      // ambil ekstensi dari url atau default png
      const ext = qrisUrl.split(".").pop()?.split("?")[0] ?? "png"
      a.download = `QRIS-${qrisName.replace(/\s+/g, "-")}.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      // fallback buka di tab baru jika fetch gagal karena CORS
      window.open(qrisUrl, "_blank")
    } finally {
      setDownloading(false)
    }
  }

  if (!qrisUrl) {
    return (
      <div
        className="dg-card flex w-full max-w-sm flex-col items-center gap-4 px-8 py-10 text-center"
        style={{
          background: bg,
          border: `1px solid ${borderAccent}`,
          borderRadius: "20px",
          boxShadow: isDark
            ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: `${accent}15`, border: `1px solid ${borderAccent}` }}
        >
          <QrCode className="h-7 w-7" style={{ color: accent }} />
        </div>
        <p className="font-sans text-sm leading-relaxed" style={{ color: isDark ? "#888" : "#555" }}>
          QRIS belum tersedia. Silakan hubungi mempelai untuk informasi pembayaran.
        </p>
      </div>
    )
  }

  return (
    <div
      className="dg-card group relative flex w-full max-w-sm flex-col items-center gap-4 px-6 py-7 text-center md:px-8"
      style={{
        background: bg,
        border: `1px solid ${borderAccent}`,
        borderRadius: "20px",
        boxShadow: isDark
          ? "0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)"
          : "0 25px 50px -12px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute left-6 right-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {/* Corner ornaments */}
      <div className="absolute left-3 top-3 text-[8px] opacity-20" style={{ color: accent }}>
        ❧
      </div>
      <div className="absolute right-3 top-3 text-[8px] opacity-20" style={{ color: accent, transform: "scaleX(-1)" }}>
        ❧
      </div>

      {/* Label */}
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4" style={{ color: accent }} />
        <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
          QRIS
        </span>
      </div>

      {/* QR Image */}
      <div
        className="relative overflow-hidden rounded-xl bg-white p-3"
        style={{ border: `1px solid ${borderAccent}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrisUrl}
          alt="QRIS Devi & Adhim"
          width={280}
          height={280}
          className="h-auto w-[220px] object-contain md:w-[260px]"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">a.n. {qrisName}</p>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px w-8" style={{ background: borderAccent }} />
        <div className="h-1.5 w-1.5 rotate-45" style={{ background: accent, opacity: 0.6 }} />
        <div className="h-px w-8" style={{ background: borderAccent }} />
      </div>

      <p className="max-w-[28ch] font-sans text-xs leading-relaxed text-muted">
        Pindai QR di atas dengan e-wallet / m-banking Anda. Satu QR untuk semua pembayaran.
      </p>

      {/* Download */}
      <Button
        onClick={handleDownload}
        disabled={downloading}
        size="sm"
        className="mt-1 flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted dark:text-white"
      >
        <Download className="h-3.5 w-3.5" />
        {downloading ? "Mengunduh..." : "Download QRIS"}
      </Button>
    </div>
  )
}

export default QrisCard
