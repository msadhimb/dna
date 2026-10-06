"use client"

const DB_NAME = "dna-buku-tamu"
const DB_VERSION = 1

export const STORE_GUESTS = "guests-cache"
export const STORE_OUTBOX = "outbox"
export const STORE_META = "meta"

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB tidak tersedia"))
      return
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_GUESTS)) {
        db.createObjectStore(STORE_GUESTS, { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) {
        const outbox = db.createObjectStore(STORE_OUTBOX, {
          keyPath: "clientId",
        })
        outbox.createIndex("by-guest", "guestId", { unique: false })
        outbox.createIndex("by-created", "createdAt", { unique: false })
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error("Gagal membuka IndexedDB"))
  })
}

function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(store, mode)
        const objectStore = transaction.objectStore(store)
        let result: T
        try {
          const req = run(objectStore)
          req.onsuccess = () => {
            result = req.result
          }
          req.onerror = () => reject(req.error ?? new Error("IDB request gagal"))
        } catch (e) {
          reject(e as Error)
          return
        }
        transaction.oncomplete = () => {
          db.close()
          resolve(result)
        }
        transaction.onerror = () => {
          db.close()
          reject(transaction.error ?? new Error("IDB transaction gagal"))
        }
      })
  )
}

export async function idbGetAll<T>(store: string): Promise<T[]> {
  if (!isBrowser()) return []
  const db = await openDb()
  return new Promise<T[]>((resolve, reject) => {
    const transaction = db.transaction(store, "readonly")
    const objectStore = transaction.objectStore(store)
    const req = objectStore.getAll()
    req.onsuccess = () => resolve((req.result as T[]) ?? [])
    req.onerror = () => reject(req.error ?? new Error("Gagal membaca IndexedDB"))
    transaction.oncomplete = () => db.close()
  })
}

export async function idbClear(store: string): Promise<void> {
  if (!isBrowser()) return
  await tx(store, "readwrite", (s) => s.clear())
}

export async function idbBulkPut(store: string, items: unknown[]): Promise<void> {
  if (!isBrowser() || items.length === 0) return
  const db = await openDb()
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(store, "readwrite")
    const objectStore = transaction.objectStore(store)
    for (const item of items) objectStore.put(item)
    transaction.oncomplete = () => {
      db.close()
      resolve()
    }
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Gagal menyimpan ke IndexedDB"))
  })
}

export async function idbPut(store: string, item: unknown): Promise<void> {
  if (!isBrowser()) return
  await tx(store, "readwrite", (s) => s.put(item))
}

export async function idbDelete(store: string, key: string): Promise<void> {
  if (!isBrowser()) return
  await tx(store, "readwrite", (s) => s.delete(key))
}

export async function idbGet<T>(store: string, key: string): Promise<T | null> {
  if (!isBrowser()) return null
  try {
    const value = await tx<T | undefined>(store, "readonly", (s) =>
      s.get(key)
    )
    return (value as T) ?? null
  } catch {
    return null
  }
}

export function canUseIndexedDb() {
  return isBrowser()
}
