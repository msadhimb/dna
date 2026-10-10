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
    <Card className="overflow-hidden">
      <style>{`@keyframes bukutamu-scanline { 0% { top: 6%; } 50% { top: 90%; } 100% { top: 6%; } }`}</style>
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
              ? `Kamera belakang aktif${cameraLabel ? ` • ${cameraLabel}` : ""}`
              : "Menyiapkan kamera..."}
          </span>
        </div>
        <div className="flex shrink-0 gap-2">
          {torchSupported && (
            <Button variant="outline" size="sm" title="Flash" onClick={onToggleTorch}>
              {torchOn ? (
                <Flashlight className="size-4" />
              ) : (
                <FlashlightOff className="size-4" />
              )}
            </Button>
          )}
          {showSwitchCamera && (
            <Button
              variant="outline"
              size="sm"
              title="Ganti kamera"
              onClick={onSwitchCamera}
            >
              <SwitchCamera className="size-4" />
            </Button>
          )}
        </div>
      </div>
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
                style={{
                  animation: "bukutamu-scanline 2.4s ease-in-out infinite",
                }}
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
    </Card>
  )
}
