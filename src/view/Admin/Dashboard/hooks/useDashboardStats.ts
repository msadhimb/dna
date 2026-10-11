"use client"

import { useQueries } from "@tanstack/react-query"
import clientApi from "@/services/client"

// Ringkasan angka dashboard: tamu, dibagikan, check-in, ucapan.
export const useDashboardStats = () => {
  const [guests, sended, checkedIn, comments] = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "guests-total"],
        queryFn: () =>
          clientApi({ url: "/guests", method: "GET", params: { page: 1, pageSize: 1 } }),
        staleTime: 30_000,
      },
      {
        queryKey: ["dashboard", "guests-sended"],
        queryFn: () =>
          clientApi({
            url: "/guests",
            method: "GET",
            params: { page: 1, pageSize: 1, sended: true },
          }),
        staleTime: 30_000,
      },
      {
        queryKey: ["dashboard", "guests-checked-in"],
        queryFn: () =>
          clientApi({
            url: "/guests",
            method: "GET",
            params: { page: 1, pageSize: 1, checked_in: true },
          }),
        staleTime: 15_000,
      },
      {
        queryKey: ["dashboard", "comments-total"],
        queryFn: () =>
          clientApi({ url: "/comments", method: "GET", params: { page: 1, pageSize: 1 } }),
        staleTime: 30_000,
      },
    ],
  })

  const num = (q: unknown): number => {
    const v = (q as { data?: { pagination?: { totalItems?: number } } })?.data
      ?.pagination?.totalItems
    return typeof v === "number" ? v : 0
  }

  return {
    totalGuests: num(guests.data),
    totalSended: num(sended.data),
    totalCheckedIn: num(checkedIn.data),
    totalComments: num(comments.data),
    isLoading: guests.isPending || sended.isPending || checkedIn.isPending || comments.isPending,
  }
}
