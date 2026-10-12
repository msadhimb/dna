"use client"

export const MANTU_DATE_ISO = "2026-12-12T09:00:00"
export const MANTU_END_ISO = "2026-12-12T15:00:00"
export const UNDUH_DATE_ISO = "2026-12-26T11:00:00"
export const UNDUH_END_ISO = "2026-12-26T13:00:00"

export type EventKey = "mantu" | "unduh"

type GuestLike = {
  mantu_status?: boolean | null
  unduh_mantu_status?: boolean | null
  checked_in_at?: string | null
  checked_in_at_mantu?: string | null
  checked_in_at_unduh?: string | null
} | null

/** Event check-in aktif mengikuti tanggal (tanpa filter manual):
 * sebelum 12 Des 2026 = mantu, sesudahnya = unduh. */
export function autoCheckInEvent(now: number = Date.now()): EventKey {
  return now >= new Date(MANTU_DATE_ISO).getTime() ? "unduh" : "mantu"
}

const pickMantuChecked = (guest: GuestLike): string | null =>
  guest?.checked_in_at_mantu ?? guest?.checked_in_at ?? null

const pickUnduhChecked = (guest: GuestLike): string | null =>
  guest?.checked_in_at_unduh ?? null

export function isCheckedForActiveEvent(
  guest: GuestLike,
  active: EventKey
): boolean {
  if (!guest) return false
  const hasMantu = !!guest.mantu_status
  const hasUnduh = !!guest.unduh_mantu_status

  if (active === "mantu") {
    if (!hasMantu) return false
    // Fallback kolom lama: kalau kolom baru belum terisi tapi kolom lama
    // terisi sebelum hari-H unduh, anggap itu check-in mantu.
    if (pickMantuChecked(guest)) return true
    return false
  }

  if (!hasUnduh) return false
  if (pickUnduhChecked(guest)) return true
  // Jangan fallback ke checked_in_at lama untuk fase unduh —
  // itu milik mantu. Kolom unduh yang jadi sumber kebenaran.
  return false
}

export function isWaitingForUnduh(
  guest: GuestLike,
  now: number = Date.now()
): boolean {
  if (!guest?.mantu_status || !guest?.unduh_mantu_status) return false
  const mantuChecked = !!pickMantuChecked(guest)
  const unduhChecked = !!pickUnduhChecked(guest)
  if (!mantuChecked || unduhChecked) return false
  return now < new Date(UNDUH_DATE_ISO).getTime()
}

/** Waktu check-in terbaru untuk ditampilkan di panel admin. */
export function latestCheckInAt(guest: GuestLike): string | null {
  const times = [
    guest?.checked_in_at_mantu,
    guest?.checked_in_at_unduh,
    guest?.checked_in_at,
  ].filter(Boolean) as string[]
  if (!times.length) return null
  return times.sort().at(-1) ?? null
}
