"use client"

import { useQuery } from "@tanstack/react-query"
import clientApi from "@/services/client"

// Daftar sudah check-in dari server — tahan refresh & sinkron antar HP panitia.
export const useCheckedInList = () => {
  const query = useQuery({
    queryKey: ["guests", "checked-in"],
    queryFn: async () => {
      const res: any = await clientApi({
        url: "/guests",
        method: "GET",
        params: {
          page: 1,
          pageSize: 5,
          checked_in: true,
          sortBy: "checked_in_at",
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
  const totalPeople =
    query.data?.summary?.totalPeople ??
    guests.reduce(
      (sum: number, g: any) => sum + (Number(g?.checked_in_count) || 0),
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
