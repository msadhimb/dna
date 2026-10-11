"use client"

import { Button } from "@/components/Button"
import Card from "@/components/Card"
import { cn } from "@/lib/utils"
import { Flashlight, FlashlightOff, SwitchCamera } from "lucide-react"

type ScannerPanelProps = {
  scanning: boolean
  cameraLabel: string
  torchSupported: boolean
  torchOn: boolean
  showSwitchCamera: boolean
  isFetchingGuest: boolean
  onToggleTorch: () => void
  onSwitchCamera: () => void
}

// Viewfinder kamera + status bar. Video dirender html5-qrcode ke #qr-viewport.
export const ScannerPanel = ({
  scanning,
  cameraLabel,
  torchSupported,
  torchOn,
  showSwitchCamera,
  isFetchingGuest,
  onToggleTorch,
  onSwitchCamera,
}: ScannerPanelProps) => {
  return (
    <Card className="overflow-hidden p-0">
      <style>{`@keyframes bukutamu-scanline { 0% { top: 6%; } 50% { top: 90%; } 100% { top: 6%; } }`}</style>
      <div className="flex items-center justify-between gap-2 border-b border-wedding-border bg-wedding-surface/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <span
            className={cn(
              "size-2.5 shrink-0 rounded-full",
              scanning ? "animate-pulse bg-emerald-500" : "bg-book-ornament"
            )}
          />
          <span className="truncate font-medium">
            {scanning
              ? `Kamera aktif${cameraLabel ? ` • ${cameraLabel}` : ""}`
              : "Menyiapkan kamera..."}
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {torchSupported && (
            <Button variant="outline" size="sm" title="Flash" onClick={onToggleTorch} className="rounded-full">
              {torchOn ? <Flashlight className="size-4" /> : <FlashlightOff className="size-4" />}
            </Button>
          )}
          {showSwitchCamera && (
            <Button variant="outline" size="sm" title="Ganti kamera" onClick={onSwitchCamera} className="rounded-full">
              <SwitchCamera className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="relative overflow-hidden rounded-2xl border border-book-ornament/30 bg-black shadow-wedding-card">
          <div id="qr-viewport" className="w-full" />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-4 left-4 size-9 rounded-tl-xl border-t-[3px] border-l-[3px] border-book-ornament" />
            <div className="absolute top-4 right-4 size-9 rounded-tr-xl border-t-[3px] border-r-[3px] border-book-ornament" />
            <div className="absolute bottom-4 left-4 size-9 rounded-bl-xl border-b-[3px] border-l-[3px] border-book-ornament" />
            <div className="absolute right-4 bottom-4 size-9 rounded-br-xl border-r-[3px] border-b-[3px] border-book-ornament" />
            {scanning && !isFetchingGuest && (
              <div
                className="absolute right-10 left-10 h-0.5 rounded-full bg-book-ornament shadow-[0_0_12px_var(--book-ornament)]"
                style={{ animation: "bukutamu-scanline 2.4s ease-in-out infinite" }}
              />
            )}
          </div>
        </div>
      </div>
      <p className="px-4 pt-0 pb-5 text-center font-serif text-[15px] text-muted italic">
        {isFetchingGuest ? "Memeriksa data tamu..." : "Posisikan QR undangan di dalam bingkai emas."}
      </p>
    </Card>
  )
}
