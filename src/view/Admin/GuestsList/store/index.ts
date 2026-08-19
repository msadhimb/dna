import { create } from "zustand"
import clientApi from "@/services/client"
import { GuestsListProps, GetGuestsParams, GetGuestsResponse } from "./type"

const useGuestsList = create<GuestsListProps>(() => ({
  getGuestsData: async (
    params: GetGuestsParams
  ): Promise<GetGuestsResponse> => {
    const query = new URLSearchParams()

    if (params.page) query.set("page", String(params.page))
    if (params.pageSize) query.set("pageSize", String(params.pageSize))
    if (params.search) query.set("search", params.search)
    if (params.sortBy) query.set("sortBy", params.sortBy)
    if (params.sortDir) query.set("sortDir", params.sortDir)

    const response = await clientApi({
      url: `/guests?${query.toString()}`,
      method: "GET",
    })

    return response
  },
  deleteGuest: async (id: string): Promise<any> => {
    return await clientApi({
      url: `/guests/${id}`,
      method: "DELETE",
    })
  },
  importGuests: async (guests) => {
    return await clientApi({
      url: "/guests",
      method: "POST",
      data: guests,
    })
  },
}))

export default useGuestsList
