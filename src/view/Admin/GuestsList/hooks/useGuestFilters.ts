"use client"

import React from "react"

// State filter tabel tamu + memo filter query + reset.
export const useGuestFilters = () => {
  const [guestFromFilter, setGuestFromFilter] = React.useState("all")
  const [mantuOnly, setMantuOnly] = React.useState(false)
  const [unduhOnly, setUnduhOnly] = React.useState(false)
  const [physicalOnly, setPhysicalOnly] = React.useState(false)
  const [sendedOnly, setSendedOnly] = React.useState(false)

  const tableFilters = React.useMemo(() => {
    const f: Record<string, unknown> = {}
    if (guestFromFilter !== "all") f.guest_from = guestFromFilter
    if (mantuOnly) f.mantu_status = true
    if (unduhOnly) f.unduh_mantu_status = true
    if (physicalOnly) f.physical_invitation = true
    if (sendedOnly) f.sended = true
    return f
  }, [guestFromFilter, mantuOnly, unduhOnly, physicalOnly, sendedOnly])

  const hasActiveFilters =
    guestFromFilter !== "all" ||
    mantuOnly ||
    unduhOnly ||
    physicalOnly ||
    sendedOnly

  const resetFilters = React.useCallback(() => {
    setGuestFromFilter("all")
    setMantuOnly(false)
    setUnduhOnly(false)
    setPhysicalOnly(false)
    setSendedOnly(false)
  }, [])

  return {
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
    tableFilters,
    hasActiveFilters,
    resetFilters,
  }
}

export type GuestFilters = ReturnType<typeof useGuestFilters>
