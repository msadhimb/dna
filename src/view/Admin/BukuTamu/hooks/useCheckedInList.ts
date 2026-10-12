"use client"

import { useQuery } from "@tanstack/react-query"
import clientApi from "@/services/client"
import type { EventKey } from "@/components/CheckInTicket/helprt/eventSchedule"

// Daftar sudah check-in dari server — tahan refresh & sinkron antar HP panitia.
// Difilter per event aktif: saat tanggal unduh tiba, statistik reset (0)
// dan hanya menghitung tamu yang check-in unduh.
export const useCheckedInList = (event: EventKey = "mantu") => {
  const query = useQuery({
    queryKey: ["guests", "checked-in", event],
    queryFn: async () => {
      const res: any = await clientApi({
        url: "/guests",
        method: "GET",
        params: {
          page: 1,
          pageSize: 5,
          checked_in: true,
          checked_in_event: event,
          sortBy: event === "unduh" ? "checked_in_at_unduh" : "checked_in_at",
          sortDir: "desc",
        },
      })
      return res
    },
    refetchInterval: 15000,
  })

  const guests: any[] = query.data?.data?.guests ?? []
  const totalGuests =
    query.data?.summary?.totalGuests ??
    query.data?.pagination?.totalItems ??
    guests.length
  // Jiwa hadir = total guest_total dari tamu yang sudah check-in.
  const totalPeople =
    query.data?.summary?.totalPeople ??
    guests.reduce(
      (sum: number, g: any) => sum + (Number(g?.guest_total) || 0),
      0
    )

  return {
    guests,
    totalGuests,
    totalPeople,
    isPending: query.isPending,
    isError: query.isError,
  }
}
