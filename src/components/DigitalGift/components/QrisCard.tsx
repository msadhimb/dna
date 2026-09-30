"use client"

import Image from "next/image"
import { useState } from "react"
import { Download, QrCode } from "lucide-react"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"

interface QrisCardProps {
  qrisUrl: string
  qrisName?: string

  accent?: string

  borderAccent?: string

  isDark?: boolean

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

      const ext = qrisUrl.split(".").pop()?.split("?")[0] ?? "png"
      a.download = `QRIS-${qrisName.replace(/\s+/g, "-")}.${ext}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {

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
        <p className="font-serif text-sm leading-relaxed text-wedding-text-secondary">
          QRIS belum tersedia. Silakan hubungi mempelai untuk informasi
          pembayaran.
        </p>
      </Card>
    )
  }

  return (
    <Card
      withCorners={false}
      withTopLine={false}
      radius="24px"
      className="dg-card group w-full max-w-sm items-stretch gap-0 overflow-hidden p-0 text-left transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between px-6 pt-5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wedding-accent/10">
            <QrCode className="h-4 w-4 text-wedding-accent" />
          </span>
          <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-wedding-text-primary">
            QRIS
          </span>
        </div>
        <span className="rounded-full bg-wedding-accent/10 px-2.5 py-1 font-sans text-[10px] font-bold tracking-[0.12em] uppercase text-wedding-accent">
          Semua e-wallet
        </span>
      </div>

      <div className="px-6 pt-5">
        <div className="relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-black/5 dark:ring-white/10">
          <img
            src={qrisUrl}
            alt="QRIS WEDDING ADHIM & DEVI"
            width={280}
            height={280}
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex flex-col items-center px-6 pt-4 text-center">
        <p className="font-sans text-[11px] font-medium tracking-[0.14em] uppercase text-wedding-text-secondary">
          a.n. {qrisName}
        </p>
        <p className="mt-2 max-w-[32ch] font-serif text-xs leading-relaxed text-wedding-text-secondary">
          Pindai QR di atas dengan e-wallet / m-banking Anda. Satu QR untuk
          semua pembayaran.
        </p>
      </div>

      <div className="px-6 pt-4 pb-6">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          size="sm"
          variant="outline"
          className="h-11 w-full rounded-full border-wedding-border-accent px-5 py-2 text-[11px] font-bold tracking-[0.18em] uppercase text-wedding-text-primary transition-all duration-200 hover:bg-wedding-accent/5 focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? "Mengunduh..." : "Download QRIS"}
        </Button>
      </div>
    </Card>
  )
}

export default QrisCard
