"use client"

import React, { useState, useRef } from "react"
import { DataTable } from "@/components/DataTable"
import useGuestsList from "./store"
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  Loader2,
  UserPlus,
} from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useConfirm } from "@/components/ConfirmDialog/store"
import * as XLSX from "xlsx"
import ModalImport from "./components/ModalImport"
import GuestFormModal from "@/components/GuestFormModal"
import { actions, columns } from "./tables/columns"
import { Button } from "@/components/Button"
import { guestFromList } from "@/helper/guestFormList"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const GuestsListView = () => {
  const { getGuestsData, deleteGuest, importGuests } = useGuestsList()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleCopyLink = (id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    navigator.clipboard.writeText(`${origin}/${id}`)
    toast.success("Link copied to clipboard")
  }

  const handleOpenCreate = () => {
    setEditingGuest(null)
    setGuestModalOpen(true)
  }

  const handleOpenEdit = (guest: any) => {
    setEditingGuest(guest)
    setGuestModalOpen(true)
  }

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["guests"] })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const selectedFile = files[0]
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: "binary" })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const rawJson = XLSX.utils.sheet_to_json<any>(ws)

        if (rawJson.length === 0) {
          toast.error("File Excel kosong atau tidak valid.")
          return
        }

        const mappedGuests = rawJson
          .map((row: any) => {
            const nameKey = Object.keys(row).find((key) =>
              /name|nama|full_name/i.test(key)
            )
            const guestFromKey = Object.keys(row).find((key) =>
              /^(guest[\s_-]*from|tamu[\s_-]*dari)$/i.test(key.trim())
            )
            const mantuKey = Object.keys(row).find((key) => /mantu/i.test(key))
            const unduhKey = Object.keys(row).find((key) =>
              /unduh|unduh.*mantu/i.test(key)
            )
            const full_name = nameKey ? String(row[nameKey] ?? "").trim() : ""

            const parseBool = (val: any) => {
              if (val === undefined || val === null) return false
              if (typeof val === "boolean") return val
              if (typeof val === "number") return val === 1
              const str = String(val).toLowerCase().trim()
              return (
                str === "true" || str === "yes" || str === "ya" || str === "1"
              )
            }

            const payload: any = {
              full_name,
              guest_from: guestFromKey ? String(row[guestFromKey]).trim() : "",
            }
            if (mantuKey) payload.mantu_status = parseBool(row[mantuKey])
            if (unduhKey) payload.unduh_mantu_status = parseBool(row[unduhKey])

            return payload
          })
          .filter((g) => !!g.full_name)

        if (mappedGuests.length === 0) {
          toast.error(
            "Tidak ditemukan kolom nama tamu yang valid (Nama/Guest Name/Nama Tamu)."
          )
          return
        }

        setParsedData(mappedGuests)
        setFile(selectedFile)
        setIsPreviewOpen(true)
      } catch (err) {
        toast.error("Gagal membaca file Excel. Pastikan format file benar.")
      }

      e.target.value = ""
    }

    reader.readAsBinaryString(selectedFile)
  }

  const handleImportSubmit = async () => {
    if (parsedData.length === 0) return

    setIsImporting(true)
    const toastId = toast.loading("Sedang mengimpor data tamu...")

    try {
      const res = await importGuests(parsedData)

      if (res.success) {
        toast.success(
          `Berhasil: ${res.inserted} tamu ditambahkan, ${res.updated} tamu diperbarui.`,
          {
            id: toastId,
            duration: 4000,
          }
        )

        setIsPreviewOpen(false)
        setParsedData([])
        setFile(null)

        queryClient.invalidateQueries({ queryKey: ["guests"] })
      } else {
        toast.error(res.message || "Gagal mengimpor data tamu.", {
          id: toastId,
          duration: 3000,
        })
      }
    } catch (error: any) {
      toast.error(
        error?.message || "Terjadi kesalahan saat mengimpor data tamu.",
        {
          id: toastId,
          duration: 3000,
        }
      )
    } finally {
      setIsImporting(false)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleExport = async (
    filters: {
      guest_from?: string
      mantu_status?: boolean
      unduh_mantu_status?: boolean
    },
    label: string
  ) => {
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
        const guests: any[] = res?.data?.guests ?? res?.data?.data?.guests ?? []
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

      const exportData = allGuests.map((g: any, idx: number) => ({
        No: idx + 1,
        "Nama Tamu": g.full_name ?? "-",
        "Tamu Dari":
          guestFromList.find((x) => x.id === g.guest_from)?.name ??
          g.guest_from ??
          "-",
        "Tamu Mantu": g.mantu_status ? "Ya" : "Tidak",
        "Tamu Unduh Mantu": g.unduh_mantu_status ? "Ya" : "Tidak",
        "Jumlah Tamu": g.guest_total ?? 0,
        "Link Undangan":
          typeof window !== "undefined"
            ? `${window.location.origin}/${g.id}`
            : g.id,
      }))

      const ws = XLSX.utils.json_to_sheet(exportData)
      ws["!cols"] = [
        { wch: 5 },
        { wch: 30 },
        { wch: 25 },
        { wch: 13 },
        { wch: 18 },
        { wch: 13 },
        { wch: 45 },
      ]
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu")
      const safeLabel = label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const fileName = `daftar-tamu-${safeLabel}.xlsx`
      XLSX.writeFile(wb, fileName)

      toast.success(
        `Berhasil mengekspor ${allGuests.length} tamu (${label}).`,
        {
          id: toastId,
          duration: 3000,
        }
      )
    } catch (error: any) {
      toast.error(error?.message || `Gagal mengekspor ${label}.`, {
        id: toastId,
        duration: 3000,
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="font-manrope w-full max-w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-bold font-sans text-foreground tracking-[0.2em] uppercase">
            Daftar Tamu Undangan
          </h1>
          <p className="text-md text-muted-foreground mt-1">
            Kelola data tamu undangan pernikahan, salin link undangan personal,
            dan import data massal dari Excel.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <Button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 hover:cursor-pointer"
          >
            <UserPlus className="size-4" />
            Tambah Tamu
          </Button>
          <Button
            onClick={triggerFileSelect}
            className="flex items-center gap-2 hover:cursor-pointer"
            variant="outline"
          >
            <FileSpreadsheet className="size-4 text-emerald-500" />
            Import Excel
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                disabled={isExporting}
                className="flex items-center gap-2 hover:cursor-pointer"
              >
                {isExporting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Download className="size-4 text-blue-500" />
                )}
                Export Tamu
                <ChevronDown className="size-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-manrope w-64">
              <DropdownMenuLabel>Export Berdasarkan</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleExport({}, "Semua Tamu")}
                className="cursor-pointer"
              >
                <Download className="size-4" />
                Export Semua Tamu
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <FileSpreadsheet className="size-4 mr-2" />
                  Tamu Dari
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="font-manrope">
                  {guestFromList.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() =>
                        handleExport(
                          { guest_from: item.id },
                          `Tamu Dari - ${item.name}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem
                onClick={() =>
                  handleExport({ mantu_status: true }, "Tamu Mantu")
                }
                className="cursor-pointer"
              >
                Tamu Mantu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleExport({ unduh_mantu_status: true }, "Tamu Unduh Mantu")
                }
                className="cursor-pointer"
              >
                Tamu Unduh Mantu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DataTable
        columns={columns({ handleCopyLink })}
        actions={actions({ handleOpenEdit, deleteGuest, confirm, queryClient })}
        queryKey="guests"
        fetcher={getGuestsData}
        filterColumn="guests_name"
        filterPlaceholder="Search guests..."
      />

      <ModalImport
        isPreviewOpen={isPreviewOpen}
        setIsPreviewOpen={setIsPreviewOpen}
        parsedData={parsedData}
        setParsedData={setParsedData}
        file={file}
        setFile={setFile}
        handleImportSubmit={handleImportSubmit}
        isImporting={isImporting}
      />

      {!editingGuest && (
        <GuestFormModal
          mode="create"
          open={guestModalOpen}
          onOpenChange={setGuestModalOpen}
          onSuccess={handleModalSuccess}
        />
      )}

      {editingGuest && (
        <GuestFormModal
          mode="edit"
          open={guestModalOpen}
          onOpenChange={(open) => {
            setGuestModalOpen(open)
            if (!open) setEditingGuest(null)
          }}
          guest={editingGuest}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}

export default GuestsListView
