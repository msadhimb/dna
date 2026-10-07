"use client"

import {
  STORE_GUESTS,
  STORE_META,
  idbBulkPut,
  idbClear,
  idbGet,
  idbGetAll,
} from "./buku-tamu-db"

export type CachedGuest = {
  id: string
  full_name: string
}

type CacheMeta = {
  key: string
  total: number
  updatedAt: number
}

const META_KEY = "guests-cache-meta"

export const saveGuestsCache = async (guests: CachedGuest[]) => {
  await idbClear(STORE_GUESTS)
  await idbBulkPut(STORE_GUESTS, guests)
  await idbBulkPut(STORE_META, [
    { key: META_KEY, total: guests.length, updatedAt: Date.now() } as CacheMeta,
  ])
}

export const getGuestsCacheMeta = async (): Promise<{
  total: number
  updatedAt: number | null
} | null> => {
  const meta = await idbGet<CacheMeta>(STORE_META, META_KEY)
  if (!meta) return null
  return { total: meta.total, updatedAt: meta.updatedAt }
}

export const searchGuestsCache = async (
  search = "",
  limit = 20
): Promise<CachedGuest[]> => {
  const all = await idbGetAll<CachedGuest>(STORE_GUESTS)
  const q = search.trim().toLowerCase()
  const filtered = q
    ? all.filter((g) => g.full_name.toLowerCase().includes(q))
    : all
  return filtered
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .slice(0, limit)
}

export const getGuestFromCache = async (
  id: string
): Promise<CachedGuest | null> => {
  return idbGet<CachedGuest>(STORE_GUESTS, id)
}

export const getAllCachedGuests = async (): Promise<CachedGuest[]> => {
  const all = await idbGetAll<CachedGuest>(STORE_GUESTS)
  return all.sort((a, b) => a.full_name.localeCompare(b.full_name))
}

export const hasGuestsCache = async (): Promise<boolean> => {
  const meta = await getGuestsCacheMeta()
  return (meta?.total ?? 0) > 0
}
