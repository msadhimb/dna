"use client"

import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((item) => (
        <div
          key={item.id}
          role="status"
          className="pointer-events-auto rounded-lg border border-border bg-background p-4 text-foreground shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              {item.title && <p className="text-sm font-semibold">{item.title}</p>}
              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              )}
            </div>
            <button
              type="button"
              aria-label="Tutup notifikasi"
              className="rounded p-1 text-muted-foreground hover:text-foreground"
              onClick={() => dismiss(item.id)}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
