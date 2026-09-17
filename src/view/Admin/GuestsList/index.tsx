"use client"

import React, { useState, useRef } from "react"
import { DataTable } from "@/components/DataTable"
import useGuestsList from "./store"
import {
  Check,
  ChevronsUpDown,
  Download,
  FileSpreadsheet,
  Filter,
  Loader2,
  UserPlus,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useConfirm } from "@/components/ConfirmDialog/store"
import * as XLSX from "xlsx"
import ModalImport from "./components/ModalImport"
import ModalShareWa from "./components/ModalShareWa"
import GuestFormModal from "@/components/GuestFormModal"
import { actions, columns } from "./tables/columns"
import { Button } from "@/components/Button"
import { guestFromList } from "@/helper/guestFormList"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

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

  // Share WA modal
  const [shareGlobalOpen, setShareGlobalOpen] = useState(false)

  // Filters - backend only
  const [guestFromFilter, setGuestFromFilter] = useState<string>("all")
  const [mantuOnly, setMantuOnly] = useState(false)
  const [unduhOnly, setUnduhOnly] = useState(false)
  const [physicalOnly, setPhysicalOnly] = useState(false)
  const [sendedOnly, setSendedOnly] = useState(false)

  const tableFilters = React.useMemo(() => {
    const f: Record<string, any> = {}
    if (guestFromFilter !== "all") f.guest_from = guestFromFilter
    if (mantuOnly) f.mantu_status = true
    if (unduhOnly) f.unduh_mantu_status = true
    if (physicalOnly) f.physical_invitation = true
    if (sendedOnly) f.sended = true
    return f
  }, [guestFromFilter, mantuOnly, unduhOnly, physicalOnly, sendedOnly])

  const hasActiveFilters =
    guestFromFilter !== "all" ||
    mantuOnly ||
    unduhOnly ||
    physicalOnly ||
    sendedOnly

  const handleResetFilters = () => {
    setGuestFromFilter("all")
    setMantuOnly(false)
    setUnduhOnly(false)
    setPhysicalOnly(false)
    setSendedOnly(false)
  }

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
            const physicalKey = Object.keys(row).find((key) =>
              /physical|fisik|cetak/i.test(key)
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
            if (physicalKey)
              payload.physical_invitation = parseBool(row[physicalKey])

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
      physical_invitation?: boolean
      sended?: boolean
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
        "Undangan Fisik": g.physical_invitation ? "Ya" : "Tidak",
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
        { wch: 15 },
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
      <div className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="font-sans text-2xl font-bold tracking-[0.15em] text-foreground uppercase sm:text-3xl sm:tracking-[0.2em]">
            Daftar Tamu Undangan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Kelola data tamu undangan pernikahan, salin link undangan personal,
            dan import data massal dari Excel.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-3 lg:w-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls, .csv"
            className="hidden"
          />
          <Button
            onClick={handleOpenCreate}
            className="flex w-full items-center justify-center gap-2 hover:cursor-pointer sm:w-auto"
          >
            <UserPlus className="size-4" />
            Tambah Tamu
          </Button>
          <Button
            onClick={triggerFileSelect}
            className="flex w-full items-center justify-center gap-2 hover:cursor-pointer sm:w-auto"
            variant="outline"
          >
            <FileSpreadsheet className="size-4 text-muted" />
            Import Excel
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns({ handleCopyLink })}
        actions={actions({
          handleOpenEdit,
          deleteGuest,
          confirm,
          queryClient,
        })}
        queryKey="guests"
        fetcher={getGuestsData}
        filterColumn="guests_name"
        filterPlaceholder="Search guests..."
        filters={tableFilters}
        toolbarExtra={
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[180px] justify-between h-8 text-sm font-normal",
                    guestFromFilter === "all" && "text-muted-foreground"
                  )}
                >
                  {guestFromFilter === "all"
                    ? "Semua Tamu Dari"
                    : (guestFromList.find((x) => x.id === guestFromFilter)
                        ?.name ?? "Tamu Dari")}
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[25rem] p-0 font-manrope"
                align="end"
              >
                <Command>
                  <CommandInput placeholder="Cari..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => setGuestFromFilter("all")}
                      >
                        <Check
                          className={cn(
                            "mr-2 size-4",
                            guestFromFilter === "all"
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        Semua Tamu Dari
                      </CommandItem>
                      {guestFromList.map((item) => (
                        <CommandItem
                          value={item.id}
                          key={item.id}
                          onSelect={() => setGuestFromFilter(item.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              item.id === guestFromFilter
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-8">
                  <Filter className="size-3.5 text-muted" />
                  Filter Lanjutan
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none text-sm">
                    Filter Status
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        Mantu
                      </span>
                      <Switch
                        checked={mantuOnly}
                        onCheckedChange={setMantuOnly}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        Unduh Mantu
                      </span>
                      <Switch
                        checked={unduhOnly}
                        onCheckedChange={setUnduhOnly}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        Undangan Fisik
                      </span>
                      <Switch
                        checked={physicalOnly}
                        onCheckedChange={setPhysicalOnly}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        WA Terkirim
                      </span>
                      <Switch
                        checked={sendedOnly}
                        onCheckedChange={setSendedOnly}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={() => {
                const parts: string[] = []
                if (guestFromFilter !== "all") {
                  const name =
                    guestFromList.find((x) => x.id === guestFromFilter)?.name ??
                    guestFromFilter
                  parts.push(name)
                }
                if (mantuOnly) parts.push("Mantu")
                if (unduhOnly) parts.push("Unduh Mantu")
                if (physicalOnly) parts.push("Undangan Fisik")
                if (sendedOnly) parts.push("WA Terkirim")
                const label = parts.length ? parts.join(" - ") : "Semua Tamu"
                handleExport(tableFilters, label)
              }}
              className="gap-1.5 h-8"
            >
              {isExporting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5 text-muted" />
              )}
              Export
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShareGlobalOpen(true)}
              className="gap-1.5 h-8 border-[#25D366]/20 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-foreground"
            >
              <FaWhatsapp className="size-3.5 text-[#25D366]" />
              Share WA
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="gap-1.5 h-8"
              >
                <XCircle className="size-3.5 text-muted" />
                Reset
              </Button>
            )}
          </>
        }
      />
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 -mt-2">
          {guestFromFilter !== "all" && (
            <Badge
              variant="outline"
              className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
            >
              <span className="text-muted-foreground">Tamu Dari:</span>
              <span className="font-medium text-foreground">
                {guestFromList.find((x) => x.id === guestFromFilter)?.name ??
                  guestFromFilter}
              </span>
              <button
                onClick={() => setGuestFromFilter("all")}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <XCircle className="size-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
          {mantuOnly && (
            <Badge
              variant="outline"
              className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
            >
              <span className="text-muted-foreground">Mantu:</span>
              <span className="font-medium text-foreground">Ya</span>
              <button
                onClick={() => setMantuOnly(false)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <XCircle className="size-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
          {unduhOnly && (
            <Badge
              variant="outline"
              className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
            >
              <span className="text-muted-foreground">Unduh Mantu:</span>
              <span className="font-medium text-foreground">Ya</span>
              <button
                onClick={() => setUnduhOnly(false)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <XCircle className="size-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
          {physicalOnly && (
            <Badge
              variant="outline"
              className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
            >
              <span className="text-muted-foreground">Undangan Fisik:</span>
              <span className="font-medium text-foreground">Ya</span>
              <button
                onClick={() => setPhysicalOnly(false)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <XCircle className="size-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
          {sendedOnly && (
            <Badge
              variant="outline"
              className="gap-1.5 border-muted bg-muted/20 py-1 text-xs font-normal"
            >
              <span className="text-muted-foreground">WA Terkirim:</span>
              <span className="font-medium text-foreground">Ya</span>
              <button
                onClick={() => setSendedOnly(false)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <XCircle className="size-3 text-muted-foreground" />
              </button>
            </Badge>
          )}
        </div>
      )}

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

      <ModalShareWa open={shareGlobalOpen} onOpenChange={setShareGlobalOpen} />

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
