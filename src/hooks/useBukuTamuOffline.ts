"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import clientApi from "@/services/client"
import {
  getAllCachedGuests,
  getGuestsCacheMeta,
  hasGuestsCache,
  saveGuestsCache,
  type CachedGuest,
} from "@/lib/guests-cache"
import {
  dedupOutbox,
  listBukuTamuOutbox,
  markBukuTamuFailed,
  removeBukuTamuItem,
  type BukuTamuOutboxItem,
} from "@/lib/buku-tamu-outbox"

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    () => (typeof navigator === "undefined" ? true : navigator.onLine)
  )

  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener("online", on)
    window.addEventListener("offline", off)
    return () => {
      window.removeEventListener("online", on)
      window.removeEventListener("offline", off)
    }
  }, [])

  return isOnline
}

async function fetchAllGuestsOnline(): Promise<CachedGuest[]> {
  const all: CachedGuest[] = []
  let page = 1
  // Batasi 20 halaman x 100 = 2000 tamu, cukup untuk undangan.
  for (let i = 0; i < 20; i++) {
    const res: any = await clientApi({
      url: "/guests",
      method: "GET",
      params: { page, pageSize: 100, sortBy: "full_name", sortDir: "asc" },
    })
    const list: any[] =
      res?.data?.guests ?? res?.data?.data?.guests ?? res?.guests ?? []
    for (const g of list) {
      if (g?.id && g?.full_name) all.push({ id: String(g.id), full_name: g.full_name })
    }
    const pagination = res?.pagination
    if (!pagination || page >= (pagination.totalPages ?? 1)) break
    page += 1
  }
  return all
}

export function useBukuTamuOffline() {
  const isOnline = useOnlineStatus()
  const [outbox, setOutbox] = useState<BukuTamuOutboxItem[]>([])
  const [cacheMeta, setCacheMeta] = useState<{
    total: number
    updatedAt: number | null
  } | null>(null)
  const [isPreloading, setIsPreloading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [cachedGuests, setCachedGuests] = useState<CachedGuest[]>([])
  const syncingRef = useRef(false)

  const refreshOutbox = useCallback(async () => {
    try {
      setOutbox(await listBukuTamuOutbox())
    } catch {
      setOutbox([])
    }
  }, [])

  const refreshMeta = useCallback(async () => {
    try {
      const [meta, has] = await Promise.all([
        getGuestsCacheMeta(),
        hasGuestsCache(),
      ])
      if (meta) setCacheMeta(meta)
      else setCacheMeta(has ? { total: 0, updatedAt: null } : null)
    } catch {
      setCacheMeta(null)
    }
    try {
      setCachedGuests(await getAllCachedGuests())
    } catch {
      setCachedGuests([])
    }
  }, [])

  useEffect(() => {
    refreshOutbox()
    refreshMeta()
  }, [refreshOutbox, refreshMeta])

  const preloadGuests = useCallback(async () => {
    setIsPreloading(true)
    try {
      const guests = await fetchAllGuestsOnline()
      await saveGuestsCache(guests)
      await refreshMeta()
      return guests.length
    } finally {
      setIsPreloading(false)
    }
  }, [refreshMeta])

  const syncOutbox = useCallback(async () => {
    if (syncingRef.current) return { synced: 0, failed: 0 }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return { synced: 0, failed: 0 }
    }
    syncingRef.current = true
    setIsSyncing(true)
    let synced = 0
    let failed = 0
    try {
      const items = await listBukuTamuOutbox()
      const queue = dedupOutbox(items.filter((i) => i.status !== "failed" || true))
      // Kirim serial satu-per-satu agar mudah tandai sukses/gagal.
      for (const item of queue) {
        try {
          await clientApi({
            url: `/guests/${item.guestId}/buku-tamu`,
            method: "PATCH",
            data: { guest_total: item.guest_total },
          })
          // Hapus SEMUA entri guestId ini (termasuk duplikat lama).
          const latest = await listBukuTamuOutbox()
          for (const dup of latest.filter((d) => d.guestId === item.guestId)) {
            await removeBukuTamuItem(dup.clientId)
          }
          synced += 1
        } catch (e: any) {
          const status = e?.status ?? e?.code ?? 500
          // 401 (sesi habis) / 404 (tamu dihapus): stop, tandai failed, jangan retry buta.
          if (status === 401 || status === 404) {
            await markBukuTamuFailed(
              item.clientId,
              status === 401 ? "Sesi habis, login ulang" : "Tamu tidak ditemukan"
            )
            failed += 1
            if (status === 401) break
          } else {
            // Network/500: biarkan pending untuk coba lagi berikutnya.
            failed += 1
          }
        }
      }
      await refreshOutbox()
      return { synced, failed }
    } finally {
      syncingRef.current = false
      setIsSyncing(false)
    }
  }, [refreshOutbox])

  // Auto-sync saat kembali online + interval 15 detik.
  useEffect(() => {
    if (!isOnline) return
    syncOutbox()
    const t = setInterval(() => {
      syncOutbox()
    }, 15000)
    const onVisible = () => {
      if (document.visibilityState === "visible") syncOutbox()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(t)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [isOnline, syncOutbox])

  return {
    isOnline,
    outbox,
    pendingCount: outbox.length,
    cacheMeta,
    hasCache: (cacheMeta?.total ?? 0) > 0 || cachedGuests.length > 0,
    cachedGuests,
    isPreloading,
    isSyncing,
    preloadGuests,
    syncOutbox,
    refreshOutbox,
    refreshMeta,
  }
}
