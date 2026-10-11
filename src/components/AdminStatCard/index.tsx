"use client"

import * as React from "react"
import Card from "@/components/Card"
import { cn } from "@/lib/utils"

type AdminStatCardProps = {
  icon: React.ReactNode
  label: string
  value: string | number
  hint?: string
  accent?: string
  className?: string
}

// Kartu statistik kecil yang konsisten di semua halaman admin.
export const AdminStatCard = ({
  icon,
  label,
  value,
  hint,
  accent = "var(--wedding-accent)",
  className,
}: AdminStatCardProps) => {
  return (
    <Card
      withCorners={false}
      className={cn("flex-row items-center gap-3.5 p-4 sm:p-5", className)}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full border"
        style={{ borderColor: accent, color: accent, background: "color-mix(in srgb, currentColor 8%, transparent)" }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-serif text-2xl leading-none font-semibold text-foreground">
          {value}
        </span>
        <span className="mt-1 block text-[11px] font-bold tracking-[0.22em] text-muted uppercase">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
    </Card>
  )
}

export default AdminStatCard
