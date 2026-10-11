"use client"

import React, { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { FileSpreadsheet, UserPlus } from "lucide-react"
import { toast } from "sonner"
import clientApi from "@/services/client"
import { DataTable } from "@/components/DataTable"
import GuestFormModal from "@/components/GuestFormModal"
import AdminPageHeader from "@/components/AdminPageHeader"
import { Button } from "@/components/Button"
import { useConfirm } from "@/components/ConfirmDialog/store"
import { buildWaMessage } from "@/helper/buildWaMessage"
import { guestFromList } from "@/helper/guestFormList"
import useGuestsList from "./store"
import { actions, columns } from "./tables/columns"
import ModalImport from "./components/ModalImport"
import ModalShareWa from "./components/ModalShareWa"
import { GuestToolbar } from "./components/GuestToolbar"
import { ActiveFilterChips } from "./components/ActiveFilterChips"
import { useGuestFilters } from "./hooks/useGuestFilters"
import { useGuestImport } from "./hooks/useGuestImport"
import { useGuestExport } from "./hooks/useGuestExport"

const GuestsListView = () => {
  const { getGuestsData, deleteGuest } = useGuestsList()
  const queryClient = useQueryClient()
  const confirm = useConfirm()
  const filters = useGuestFilters()
  const guestImport = useGuestImport()
  const { isExporting, handleExport } = useGuestExport()

  const [guestModalOpen, setGuestModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any | null>(null)
  const [shareGlobalOpen, setShareGlobalOpen] = useState(false)

  const handleCopyLink = (id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    navigator.clipboard.writeText(`${origin}/${id}`)
    toast.success("Link disalin ke clipboard")
  }

  const handleShareWa = (guest: any) => {
    const origin = typeof window !== "undefined" ? window.location.origin : ""
    const link = `${origin}/${guest.id}`
    window.open(
      `https://wa.me/?text=${encodeURIComponent(buildWaMessage(guest, link))}`,
      "_blank",
      "noopener,noreferrer"
    )
    clientApi({ url: `/guests/${guest.id}`, method: "PATCH", data: { sended: true } })
      .then(() => queryClient.invalidateQueries({ queryKey: ["guests"] }))
      .catch((err) => console.error("Failed to update sended status:", err))
    toast.success(`Membuka WhatsApp untuk ${guest.full_name}…`)
  }

  const handleToggleSended = async (guest: any) => {
    const next = !guest.sended
    const toastId = toast.loading(
      next ? `Menandai ${guest.full_name} sudah dibagikan...` : `Membatalkan tanda ${guest.full_name}...`
    )
    try {
      await clientApi({ url: `/guests/${guest.id}`, method: "PATCH", data: { sended: next } })
      toast.success(next ? `${guest.full_name} sudah dibagikan` : `${guest.full_name} belum dibagikan`, {
        id: toastId,
        duration: 2000,
      })
      queryClient.invalidateQueries({ queryKey: ["guests"] })
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Gagal memperbarui status", {
        id: toastId,
      })
    }
  }

  const handleExportClick = () => {
    const parts: string[] = []
    if (filters.guestFromFilter !== "all")
      parts.push(guestFromList.find((x) => x.id === filters.guestFromFilter)?.name ?? filters.guestFromFilter)
    if (filters.mantuOnly) parts.push("Mantu")
    if (filters.unduhOnly) parts.push("Ngunduh Mantu")
    if (filters.physicalOnly) parts.push("Undangan Fisik")
    if (filters.sendedOnly) parts.push("WA Terkirim")
    handleExport(filters.tableFilters, parts.length ? parts.join(" - ") : "Semua Tamu")
  }

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["guests"] })

  return (
    <div className="w-full max-w-full space-y-6 font-manrope">
      <AdminPageHeader
        title="Daftar Tamu"
        description="Kelola tamu, salin link personal, import Excel, dan bagikan undangan via WhatsApp."
        actions={
          <>
            <input
              type="file"
              ref={guestImport.fileInputRef}
              onChange={guestImport.handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <Button onClick={() => { setEditingGuest(null); setGuestModalOpen(true) }} className="w-full sm:w-auto">
              <UserPlus className="size-4" />
              Tambah Tamu
            </Button>
            <Button onClick={guestImport.triggerFileSelect} variant="outline" className="w-full sm:w-auto">
              <FileSpreadsheet className="size-4 text-muted" />
              Import Excel
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns({ handleCopyLink })}
        actions={actions({
          handleOpenEdit: (g: any) => { setEditingGuest(g); setGuestModalOpen(true) },
          handleShareWa,
          handleToggleSended,
          deleteGuest,
          confirm,
          queryClient,
        })}
        queryKey="guests"
        fetcher={getGuestsData}
        filterColumn="guests_name"
        filterPlaceholder="Cari nama tamu..."
        filters={filters.tableFilters}
        actionsColumnWidth={90}
        toolbarExtra={
          <GuestToolbar
            filters={filters}
            isExporting={isExporting}
            onExport={handleExportClick}
            onShareWa={() => setShareGlobalOpen(true)}
          />
        }
      />
      <ActiveFilterChips filters={filters} />

      <ModalImport
        isPreviewOpen={guestImport.isPreviewOpen}
        setIsPreviewOpen={guestImport.setIsPreviewOpen}
        parsedData={guestImport.parsedData}
        setParsedData={guestImport.setParsedData}
        file={guestImport.file}
        setFile={guestImport.setFile}
        handleImportSubmit={guestImport.handleImportSubmit}
        isImporting={guestImport.isImporting}
      />
      <ModalShareWa open={shareGlobalOpen} onOpenChange={setShareGlobalOpen} onSent={invalidate} />

      {!editingGuest ? (
        <GuestFormModal mode="create" open={guestModalOpen} onOpenChange={setGuestModalOpen} onSuccess={invalidate} />
      ) : (
        <GuestFormModal
          mode="edit"
          open={guestModalOpen}
          onOpenChange={(open) => { setGuestModalOpen(open); if (!open) setEditingGuest(null) }}
          guest={editingGuest}
          onSuccess={invalidate}
        />
      )}
    </div>
  )
}

export default GuestsListView
