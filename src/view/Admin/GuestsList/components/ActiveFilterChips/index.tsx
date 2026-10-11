"use client"

import { XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { guestFromList } from "@/helper/guestFormList"
import type { GuestFilters } from "../../hooks/useGuestFilters"

// Chip filter aktif di bawah toolbar — klik ✕ untuk melepas satu filter.
export const ActiveFilterChips = ({ filters }: { filters: GuestFilters }) => {
  const {
    guestFromFilter,
    setGuestFromFilter,
    mantuOnly,
    setMantuOnly,
    unduhOnly,
    setUnduhOnly,
    physicalOnly,
    setPhysicalOnly,
    sendedOnly,
    setSendedOnly,
    hasActiveFilters,
  } = filters

  if (!hasActiveFilters) return null

  const chips: { label: string; value: string; clear: () => void }[] = []
  if (guestFromFilter !== "all")
    chips.push({
      label: "Tamu Dari",
      value: guestFromList.find((x) => x.id === guestFromFilter)?.name ?? guestFromFilter,
      clear: () => setGuestFromFilter("all"),
    })
  if (mantuOnly) chips.push({ label: "Mantu", value: "Ya", clear: () => setMantuOnly(false) })
  if (unduhOnly) chips.push({ label: "Ngunduh Mantu", value: "Ya", clear: () => setUnduhOnly(false) })
  if (physicalOnly) chips.push({ label: "Undangan Fisik", value: "Ya", clear: () => setPhysicalOnly(false) })
  if (sendedOnly) chips.push({ label: "WA Terkirim", value: "Ya", clear: () => setSendedOnly(false) })

  return (
    <div className="-mt-2 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Badge
          key={chip.label}
          variant="outline"
          className="gap-1.5 border-wedding-border bg-wedding-surface py-1 text-xs font-normal shadow-xs"
        >
          <span className="text-muted-foreground">{chip.label}:</span>
          <span className="font-medium text-foreground">{chip.value}</span>
          <button
            onClick={chip.clear}
            aria-label={`Hapus filter ${chip.label}`}
            className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-muted/30"
          >
            <XCircle className="size-3 text-muted-foreground" />
          </button>
        </Badge>
      ))}
    </div>
  )
}
