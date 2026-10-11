"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type SegmentedOption<T extends string> = {
  value: T
  label: string
  icon?: React.ReactNode
}

type AdminSegmentedControlProps<T extends string> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

// Pill switch elegan (dipakai Buku Tamu: Scan QR / Cari Manual).
export const AdminSegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  className,
}: AdminSegmentedControlProps<T>) => {
  return (
    <div
      role="tablist"
      aria-label="Mode"
      className={cn(
        "grid w-full grid-cols-2 gap-1 rounded-full border border-wedding-border bg-wedding-surface p-1 shadow-wedding-card sm:w-auto sm:min-w-72",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all",
              active
                ? "bg-muted text-secondary shadow-sm dark:bg-primary dark:text-white"
                : "text-muted-foreground hover:bg-muted/15 hover:text-foreground"
            )}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default AdminSegmentedControl
