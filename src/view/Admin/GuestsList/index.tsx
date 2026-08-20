"use client"

import React, { useState, useRef } from "react"
import { DataTable } from "@/components/DataTable"
import useGuestsList from "./store"
import { FileSpreadsheet, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useConfirm } from "@/components/ConfirmDialog/store"
import * as XLSX from "xlsx"
import ModalImport from "./components/ModalImport"
import GuestFormModal from "@/components/GuestFormModal"
import { actions, columns } from "./tables/columns"
import { Button } from "@/components/Button"

const GuestsListView = () => {
  const { getGuestsData, deleteGuest, importGuests } = useGuestsList()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

  // Excel Upload States
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<any[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  // Guest Form Modal States
  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any | null>(null)

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

  // Smart case-insensitive parser for Excel data
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

        // Map column names dynamically & smartly (e.g. "Nama Tamu", "Nama", "Guest Name", etc)
        const mappedGuests = rawJson
          .map((row: any) => {
            // Find potential keys
            const nameKey = Object.keys(row).find((key) =>
              /name|nama|full_name/i.test(key)
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

            const payload: any = { full_name }

            if (mantuKey) payload.mantu_status = parseBool(row[mantuKey])

            if (unduhKey) payload.unduh_mantu_status = parseBool(row[unduhKey])

            return payload
          })
          .filter((g) => !!g.full_name) // Filter out rows with no guest name

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
        console.error("Error parsing Excel:", err)
        toast.error("Gagal membaca file Excel. Pastikan format file benar.")
      }

      // Reset input value to allow uploading same file again if needed
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

        // Refresh the table query
        queryClient.invalidateQueries({ queryKey: ["guests"] })
      } else {
        toast.error(res.message || "Gagal mengimpor data tamu.", {
          id: toastId,
          duration: 3000,
        })
      }
    } catch (error: any) {
      console.error("Error during import submit:", error)
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

  return (
    <div className="font-manrope w-full max-w-full space-y-6">
      {/* Header Section */}
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
        <div className="flex items-center gap-3">
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

      {/* Guest Form Modal — create mode */}
      {!editingGuest && (
        <GuestFormModal
          mode="create"
          open={guestModalOpen}
          onOpenChange={setGuestModalOpen}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Guest Form Modal — edit mode */}
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
