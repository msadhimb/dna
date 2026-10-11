"use client"

import React from "react"
import { toast } from "sonner"
import * as XLSXStyle from "xlsx-js-style"
import { guestFromList } from "@/helper/guestFormList"
import useGuestsList from "../store"

// Export Excel ber-style + rekap rumus, diurut Tamu Dari A-Z.
export const useGuestExport = () => {
  const { getGuestsData } = useGuestsList()
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = React.useCallback(
    async (filters: Record<string, unknown>, label: string) => {
      setIsExporting(true)
      const toastId = toast.loading(`Sedang mengekspor ${label}...`)
      try {
        const allGuests: any[] = []
        let page = 1
        const pageSize = 100
        while (true) {
          const res: any = await getGuestsData({
            page,
            pageSize,
            sortBy: "full_name",
            sortDir: "asc",
            ...filters,
          })
          const guests: any[] =
            res?.data?.guests ?? res?.data?.data?.guests ?? []
          if (guests.length === 0) break
          allGuests.push(...guests)
          const totalPages = res?.pagination?.totalPages ?? 1
          if (page >= totalPages || guests.length < pageSize) break
          page++
        }
        if (allGuests.length === 0) {
          toast.error(`Tidak ada data untuk ${label}.`, { id: toastId })
          return
        }
        const fromName = (g: any) =>
          guestFromList.find((x) => x.id === g.guest_from)?.name ??
          (g.guest_from ? String(g.guest_from) : "-")
        const sorted = [...allGuests].sort((a: any, b: any) => {
          const c =
            fromName(a).localeCompare(fromName(b), "id", {
              sensitivity: "base",
            }) ||
            String(a.full_name ?? "").localeCompare(
              String(b.full_name ?? ""),
              "id",
              { sensitivity: "base" }
            )
          return c
        })
        const totalTamu = sorted.reduce(
          (s: number, g: any) => s + (Number(g.guest_total) || 0),
          0
        )
        const exportData = sorted.map((g: any, idx: number) => ({
          No: idx + 1,
          "Nama Tamu": g.full_name ?? "-",
          "Tamu Dari": fromName(g),
          "Tamu Mantu": g.mantu_status ? "Ya" : "Tidak",
          "Tamu Ngunduh Mantu": g.unduh_mantu_status ? "Ya" : "Tidak",
          "Undangan Fisik": g.physical_invitation ? "Ya" : "Tidak",
          "Jumlah Tamu": Number(g.guest_total) || 0,
        }))
        const ws = XLSXStyle.utils.json_to_sheet(exportData)
        const rowCount = exportData.length + 1
        XLSXStyle.utils.sheet_add_aoa(
          ws,
          [
            ["REKAP TAMU", ""],
            ["Jumlah Undangan", allGuests.length],
            ["Total Semua Tamu", totalTamu],
          ],
          { origin: "I1" }
        )
        ws["J2"] = {
          t: "n",
          f: `ROWS(A2:A${rowCount})`,
          v: allGuests.length,
        } as never
        ws["J3"] = {
          t: "n",
          f: `SUM(G2:G${rowCount})`,
          v: totalTamu,
        } as never

        const thin = {
          top: { style: "thin" as const, color: { rgb: "9CA3AF" } },
          bottom: { style: "thin" as const, color: { rgb: "9CA3AF" } },
          left: { style: "thin" as const, color: { rgb: "9CA3AF" } },
          right: { style: "thin" as const, color: { rgb: "9CA3AF" } },
        }
        const head = {
          font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "047857" } },
          alignment: { horizontal: "center" as const, vertical: "center" as const },
          border: thin,
        }
        for (let c = 0; c < 7; c++) {
          const addr = XLSXStyle.utils.encode_cell({ r: 0, c })
          if (ws[addr]) (ws[addr] as { s?: unknown }).s = head
        }
        for (let r = 1; r < rowCount; r++) {
          const fill =
            r % 2 === 0
              ? { fgColor: { rgb: "ECFDF5" } }
              : { fgColor: { rgb: "FFFFFF" } }
          for (let c = 0; c < 7; c++) {
            const addr = XLSXStyle.utils.encode_cell({ r, c })
            const cell = ws[addr] as { s?: unknown } | undefined
            if (!cell) continue
            cell.s = {
              font: { sz: 11, color: { rgb: "111827" } },
              fill,
              alignment: {
                horizontal: c === 1 || c === 2 ? "left" : "center",
                vertical: "center",
              },
              border: thin,
            }
          }
        }
        ws["!autofilter"] = { ref: `A1:G${rowCount}` }
        ws["!cols"] = [
          { wch: 5 },
          { wch: 30 },
          { wch: 25 },
          { wch: 13 },
          { wch: 18 },
          { wch: 15 },
          { wch: 13 },
          { wch: 3 },
          { wch: 20 },
          { wch: 18 },
        ]
        const wb = XLSXStyle.utils.book_new()
        XLSXStyle.utils.book_append_sheet(wb, ws, "Daftar Tamu")
        const safe = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        XLSXStyle.writeFile(wb, `daftar-tamu-${safe}.xlsx`)
        toast.success(`Berhasil mengekspor ${allGuests.length} tamu (${label}).`, {
          id: toastId,
        })
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : `Gagal mengekspor ${label}.`,
          { id: toastId }
        )
      } finally {
        setIsExporting(false)
      }
    },
    [getGuestsData]
  )

  return { isExporting, handleExport }
}
