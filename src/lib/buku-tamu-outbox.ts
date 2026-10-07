"use client"

import {
  STORE_OUTBOX,
  idbDelete,
  idbGetAll,
  idbPut,
} from "./buku-tamu-db"

export type OutboxStatus = "pending" | "failed"

export type BukuTamuOutboxItem = {
  clientId: string
  guestId: string
  guestName: string
  guest_total: number
  createdAt: number
  status: OutboxStatus
  lastError?: string
}

export const newClientId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const enqueueBukuTamu = async (item: BukuTamuOutboxItem) => {
  await idbPut(STORE_OUTBOX, item)
}

export const listBukuTamuOutbox = async (): Promise<BukuTamuOutboxItem[]> => {
  const all = await idbGetAll<BukuTamuOutboxItem>(STORE_OUTBOX)
  return all.sort((a, b) => a.createdAt - b.createdAt)
}

export const removeBukuTamuItem = async (clientId: string) => {
  await idbDelete(STORE_OUTBOX, clientId)
}

export const markBukuTamuFailed = async (clientId: string, message: string) => {
  const all = await listBukuTamuOutbox()
  const item = all.find((i) => i.clientId === clientId)
  if (!item) return
  await idbPut(STORE_OUTBOX, {
    ...item,
    status: "failed" as OutboxStatus,
    lastError: message,
  })
}

/** Dedup per guestId: ambil entri terakhir (last-write-wins). */
export const dedupOutbox = (items: BukuTamuOutboxItem[]) => {
  const byGuest = new Map<string, BukuTamuOutboxItem>()
  for (const item of items) {
    const prev = byGuest.get(item.guestId)
    if (!prev || item.createdAt >= prev.createdAt) byGuest.set(item.guestId, item)
  }
  return [...byGuest.values()].sort((a, b) => a.createdAt - b.createdAt)
}
