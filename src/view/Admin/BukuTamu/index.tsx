"use client"

import { Button } from "@/components/Button"
import { FormInput } from "@/components/Form/FormInput"
import FormSelect from "@/components/Form/FormSelect"
import clientApi from "@/services/client"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import { NumericFormat } from "react-number-format"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast } from "sonner"
import { useBukuTamuOffline } from "@/hooks/useBukuTamuOffline"
import { getGuestFromCache, searchGuestsCache } from "@/lib/guests-cache"
import {
  enqueueBukuTamu,
  newClientId,
  removeBukuTamuItem,
} from "@/lib/buku-tamu-outbox"
import { useQuery } from "@tanstack/react-query"

const schema = yup.object({
  guest: yup.string().required("Tamu wajib dipilih"),
  guest_total: yup
    .number()
    .typeError("Jumlah tamu harus berupa angka")
    .required("Jumlah tamu wajib diisi")
    .min(1, "Jumlah tamu minimal 1"),
})

type FormValues = yup.InferType<typeof schema>

const BukuTamu = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormValues>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      guest: "",
      guest_total: 0,
    },
  })

  const {
    isOnline,
    outbox,
    pendingCount,
    cacheMeta,
    hasCache,
    cachedGuests,
    isPreloading,
    isSyncing,
    preloadGuests,
    syncOutbox,
    refreshOutbox,
  } = useBukuTamuOffline()

  const [isSaving, setIsSaving] = React.useState(false)

  const saveOffline = async (data: FormValues) => {
    // Tanpa fallback: tamu HARUS ada di cache hasil preload.
    const cached = await getGuestFromCache(data.guest)
    if (!cached) {
      toast?.error?.(
        "Tamu tak terdaftar. Sambungkan internet untuk memuat daftar tamu."
      )
      return
    }
    await enqueueBukuTamu({
      clientId: newClientId(),
      guestId: cached.id,
      guestName: cached.full_name,
      guest_total: Number(data.guest_total),
      createdAt: Date.now(),
      status: "pending",
    })
    await refreshOutbox()
    toast?.success?.("Tersimpan offline, akan terkirim otomatis saat online")
    reset()
  }

  // Kirim online; kalau jaringan putus di tengah jalan ikut masuk antrian.
  const sendOnline = async (data: FormValues) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      await saveOffline(data)
      return
    }
    try {
      const res: any = await clientApi({
        url: `/guests/${data.guest}/buku-tamu`,
        method: "PATCH",
        data: { guest_total: data.guest_total },
      })
      if (res) {
        toast?.success?.("Silahkan Masuk")
        reset()
      }
    } catch (e: any) {
      const isNetworkError = !e?.status || e?.status >= 500
      if (isNetworkError) {
        // Jaringan putus di tengah jalan: simpan offline jika tamu dikenal.
        const cached = await getGuestFromCache(data.guest)
        if (cached) {
          await enqueueBukuTamu({
            clientId: newClientId(),
            guestId: cached.id,
            guestName: cached.full_name,
            guest_total: Number(data.guest_total),
            createdAt: Date.now(),
            status: "pending",
          })
          await refreshOutbox()
          toast?.success?.("Koneksi terputus, tersimpan offline")
          reset()
          return
        }
      }
      toast?.error?.(e?.message || "Gagal menyimpan data")
    }
    clearErrors()
  }

  const onSubmit = async (data: FormValues) => {
    if (isSaving) return
    setIsSaving(true)
    try {
      const offline =
        typeof navigator !== "undefined" ? !navigator.onLine : false
      if (offline) {
        await saveOffline(data)
        return
      }
      await sendOnline(data)
    } finally {
      setIsSaving(false)
    }
  }

  const fetchGuests = React.useCallback(async ({ page, search }: any) => {
    // Offline murni: cari dari IndexedDB hasil preload.
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const cached = await searchGuestsCache(search ?? "", 50)
      return {
        data: { guests: cached },
        pagination: {
          page: 1,
          pageSize: 50,
          totalItems: cached.length,
          totalPages: 1,
        },
      }
    }
    // Online tapi request gagal (wifi nyambung tapi internet putus):
    // fallback ke cache agar dropdown tidak kosong.
    try {
      return await clientApi({
        url: "/guests",
        method: "GET",
        params: { page, search },
      })
    } catch {
      const cached = await searchGuestsCache(search ?? "", 50)
      if (cached.length > 0) {
        return {
          data: { guests: cached },
          pagination: {
            page: 1,
            pageSize: 50,
            totalItems: cached.length,
            totalPages: 1,
          },
        }
      }
      throw new Error("Gagal memuat daftar tamu")
    }
  }, [])

  const offlineOptions = React.useMemo(
    () =>
      cachedGuests.map((g) => ({
        value: g.id,
        label: g.full_name,
      })),
    [cachedGuests]
  )

  const handlePreload = async () => {
    try {
      await preloadGuests()
    } catch (e: any) {
      toast?.error?.(e?.message || "Gagal memuat daftar tamu")
    }
  }

  const handleSync = async () => {
    const { synced, failed } = await syncOutbox()
    if (synced > 0 && failed === 0)
      toast?.success?.(`${synced} data tersinkron`)
    else if (synced > 0)
      toast?.success?.(`${synced} tersinkron, ${failed} gagal`)
    else if (failed > 0) toast?.error?.("Sync gagal, cek koneksi / sesi login")
    else if (pendingCount === 0) toast?.success?.("Tidak ada antrian")
  }

  const handleDeleteQueue = async (clientId: string) => {
    await removeBukuTamuItem(clientId)
    await refreshOutbox()
  }

  useQuery({
    queryKey: ["buku-tamu-outbox"],
    queryFn: () => handlePreload(),
  })

  const cacheLabel =
    cacheMeta && cacheMeta.updatedAt
      ? `${cacheMeta.total} tamu • ${new Date(cacheMeta.updatedAt).toLocaleString("id-ID")}`
      : hasCache
        ? `${cacheMeta?.total ?? 0} tamu tersimpan`
        : "Belum ada data offline"

  return (
    <div className="min-h-[80vh]">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Buku Tamu
          </h1>
          <p className="mt-1 text-md text-muted-foreground">
            Catat kehadiran dan jumlah rombongan tamu di buku tamu.
          </p>
        </div>
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
            isOnline
              ? "border-green-800/40 bg-green-800/10 text-green-700 dark:text-green-400"
              : "border-amber-600/40 bg-amber-600/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-600" : "bg-amber-500"}`}
          />
          {isOnline ? "Online" : `Offline • ${pendingCount} antrian`}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-6 justify-center h-full">
        <div className="bg-card border border-border rounded-xl shadow-sm w-full max-w-2xl flex flex-col gap-8 p-8">
          {!isOnline && !hasCache && (
            <div className="rounded-lg border border-amber-600/40 bg-amber-600/10 p-3 text-xs text-amber-700 dark:text-amber-400">
              Data tamu offline belum dimuat. Sambungkan internet sekali lalu
              tekan &quot;Muat Daftar Tamu&quot; sebelum bertugas.
            </div>
          )}
          <div className="flex flex-col gap-5">
            <Controller
              name="guest"
              control={control}
              render={({ field }) => (
                <FormSelect
                  {...field}
                  key={isOnline ? "online" : "offline"}
                  label="Tamu"
                  {...(!isOnline
                    ? { options: offlineOptions }
                    : {
                        apiConfig: fetchGuests,
                        valueKey: "id",
                        labelKey: "full_name",
                        resolveEndpoint: "/guests",
                      })}
                  placeholder={
                    !isOnline && !hasCache
                      ? "Butuh internet / preload dulu"
                      : "Pilih Tamu"
                  }
                  error={errors.guest?.message}
                  disabled={!isOnline && !hasCache}
                />
              )}
            />

            <Controller
              name="guest_total"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value}
                  thousandSeparator=","
                  onValueChange={(values, sourceInfo) => {
                    if (sourceInfo.source !== "event") return
                    field.onChange(values.floatValue)
                  }}
                  label="Jumlah Tamu"
                  customInput={FormInput}
                  error={errors.guest_total?.message}
                />
              )}
            />
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => handleSubmit(onSubmit)()}
          >
            {isSaving
              ? "Menyimpan..."
              : !isOnline
                ? `Simpan Offline${pendingCount > 0 ? ` (${pendingCount} antrian)` : ""}`
                : "Kirim"}
          </Button>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>Data offline: {cacheLabel}</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={!isOnline || isSyncing || pendingCount === 0}
              >
                {isSyncing ? "Sync..." : `Sinkron (${pendingCount})`}
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-widest uppercase">
              Antrian Offline ({pendingCount})
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Tersimpan di IndexedDB • aman walau reload
            </span>
          </div>
          {outbox.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
              Tidak ada antrian. Semua data sudah tersinkron.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {outbox.map((item) => (
                <li
                  key={item.clientId}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {item.guestName}{" "}
                      <span className="font-normal text-muted-foreground">
                        • {item.guest_total} orang
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("id-ID")} •{" "}
                      {item.status === "failed"
                        ? `Gagal: ${item.lastError ?? "cek sesi/login"}`
                        : "Menunggu sync"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQueue(item.clientId)}
                  >
                    Hapus
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[11px] text-muted-foreground">
            Lihat teknis: F12 → Application → IndexedDB → dna-buku-tamu. Tamu
            tak terdaftar tidak bisa disimpan offline (tanpa fallback).
          </p>
        </div>
      </div>
    </div>
  )
}

export default BukuTamu
