import { create } from "zustand"

export type Guest = {
  id: string
  full_name: string | null
  guest_from: string | null
  mantu_status: boolean
  unduh_mantu_status: boolean
  checked_in_at: string | null
  checked_in_at_mantu: string | null
  checked_in_at_unduh: string | null
  checked_in_count: number | null
}

type GuestStore = {
  guest: Guest | null
  setGuest: (guest: Guest | null) => void
  clearGuest: () => void
}

export const useGuest = create<GuestStore>((set) => ({
  guest: null,
  setGuest: (guest) => set({ guest }),
  clearGuest: () => set({ guest: null }),
}))
