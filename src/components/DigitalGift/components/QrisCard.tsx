"use client"

import Image from "next/image"
import { useState } from "react"
import { Download, QrCode } from "lucide-react"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"

interface QrisCardProps {
  qrisUrl: string
  qrisName?: string
  /** @deprecated — terpusat via Tailwind */
  accent?: string
  /** @deprecated */
  borderAccent?: string
  /** @deprecated */
  isDark?: boolean
  /** @deprecated */
  surface?: string
}

const QrisCard = ({
  qrisUrl,
  qrisName = "WEDDING ADHIM & DEVI",
}: QrisCardProps) => {
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
      <Card className="dg-card w-full max-w-sm items-center gap-4 px-8 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wedding-accent/10 border border-wedding-border-accent">
          <QrCode className="h-7 w-7 text-wedding-accent" />
        </div>
        <p className="font-sans text-sm leading-relaxed text-wedding-text-secondary">
          QRIS belum tersedia. Silakan hubungi mempelai untuk informasi
          pembayaran.
        </p>
      </Card>
    )
  }

  return (
    <Card className="dg-card group w-full max-w-lg items-center gap-4 px-6 py-7 text-center md:px-8">
      {/* Label */}
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-wedding-accent" />
        <span className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-wedding-accent">
          QRIS
        </span>
      </div>

      {/* QR Image */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-wedding-border-accent">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrisUrl}
          alt="QRIS WEDDING ADHIM & DEVI"
          width={280}
          height={280}
          className="h-auto w-64 object-contain md:w-88"
          loading="lazy"
        />
      </div>

      {/* Name */}
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
        a.n. {qrisName}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px w-8 bg-wedding-border-accent" />
        <div className="h-1.5 w-1.5 rotate-45 bg-wedding-accent opacity-60" />
        <div className="h-px w-8 bg-wedding-border-accent" />
      </div>

      <p className="max-w-[28ch] font-sans text-xs leading-relaxed text-muted">
        Pindai QR di atas dengan e-wallet / m-banking Anda. Satu QR untuk semua
        pembayaran.
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
    </Card>
  )
}

export default QrisCard
