"use client"

import React from "react"
import * as XLSX from "xlsx"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import useGuestsList from "../store"

// Baca file Excel -> preview -> import massal.
export const useGuestImport = () => {
  const { importGuests } = useGuestsList()
  const queryClient = useQueryClient()
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [parsedData, setParsedData] = React.useState<any[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [isImporting, setIsImporting] = React.useState(false)

  const parseBool = (val: unknown) => {
    if (val === undefined || val === null) return false
    if (typeof val === "boolean") return val
    if (typeof val === "number") return val === 1
    const str = String(val).toLowerCase().trim()
    return str === "true" || str === "yes" || str === "ya" || str === "1"
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
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws)
        if (rawJson.length === 0) {
          toast.error("File Excel kosong atau tidak valid.")
          return
        }
        const mapped = rawJson
          .map((row) => {
            const keys = Object.keys(row)
            const nameKey = keys.find((k) => /name|nama|full_name/i.test(k))
            const fromKey = keys.find((k) =>
              /^(guest[\s_-]*from|tamu[\s_-]*dari)$/i.test(k.trim())
            )
            const mantuKey = keys.find((k) => /mantu/i.test(k))
            const unduhKey = keys.find((k) => /unduh/i.test(k))
            const physicalKey = keys.find((k) =>
              /physical|fisik|cetak/i.test(k)
            )
            const full_name = nameKey ? String(row[nameKey] ?? "").trim() : ""
            const payload: Record<string, unknown> = {
              full_name,
              guest_from: fromKey ? String(row[fromKey]).trim() : "",
            }
            if (mantuKey) payload.mantu_status = parseBool(row[mantuKey])
            if (unduhKey) payload.unduh_mantu_status = parseBool(row[unduhKey])
            if (physicalKey)
              payload.physical_invitation = parseBool(row[physicalKey])
            return payload
          })
          .filter((g) => !!g.full_name)
        if (mapped.length === 0) {
          toast.error("Tidak ditemukan kolom nama tamu yang valid.")
          return
        }
        setParsedData(mapped)
        setFile(selectedFile)
        setIsPreviewOpen(true)
      } catch {
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
          `Berhasil: ${res.inserted} ditambahkan, ${res.updated} diperbarui.`,
          { id: toastId, duration: 4000 }
        )
        setIsPreviewOpen(false)
        setParsedData([])
        setFile(null)
        queryClient.invalidateQueries({ queryKey: ["guests"] })
      } else {
        toast.error(res.message || "Gagal mengimpor data tamu.", { id: toastId })
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengimpor data tamu.",
        { id: toastId }
      )
    } finally {
      setIsImporting(false)
    }
  }

  return {
    fileInputRef,
    file,
    setFile,
    parsedData,
    setParsedData,
    isPreviewOpen,
    setIsPreviewOpen,
    isImporting,
    handleFileChange,
    handleImportSubmit,
    triggerFileSelect: () => fileInputRef.current?.click(),
  }
}
