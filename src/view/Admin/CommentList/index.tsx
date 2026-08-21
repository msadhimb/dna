"use client"

import { AttendanceBadge } from "@/components/AttendanceBadge"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import useCommentsList from "./store"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import moment from "moment"
import { useConfirm } from "@/components/ConfirmDialog/store"

moment.locale("id")

const CommentListView = () => {
  const { getCommentsData, deleteComment } = useCommentsList()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

  const columns: ColumnDef<any>[] = [
    {
      id: "full_name",
      header: "Nama Tamu",
      accessorFn: (row) => row.guest?.full_name || "-",
      cell: ({ row }) => (
        <span className="font-semibold text-muted dark:text-white">
          {row.original.name || "-"}
        </span>
      ),
    },
    {
      accessorKey: "comment",
      header: "Pesan Doa & Harapan",
      cell: ({ row }) => (
        <div className="max-w-[400px] whitespace-normal break-words text-sm text-muted-foreground">
          &quot;{row.getValue("comment")}&quot;
        </div>
      ),
    },
    {
      accessorKey: "arrival_status",
      header: () => <div className="text-center">Kehadiran</div>,
      size: 120,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <AttendanceBadge status={row.getValue("arrival_status") as string} />
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Waktu Kirim",
      size: 180,
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return <span>{moment(date).format("dddd, DD MMMM YYYY")}</span>
      },
    },
  ]

  const actions = [
    {
      label: "Delete",
      icon: <Trash className="h-4 w-4" />,
      destructive: true,
      onClick: async (row: any) => {
        const guestName = row.guest?.full_name || "Tamu Tanpa Nama"
        const isConfirmed = await confirm({
          title: "Hapus Doa & Harapan",
          description: `Apakah Anda yakin ingin menghapus ucapan doa dari ${guestName}? Tindakan ini tidak dapat dibatalkan.`,
          confirmText: "Ya, Hapus",
          cancelText: "Batal",
          variant: "destructive",
        })
        if (!isConfirmed) return

        const toastId = toast.loading(
          `Sedang menghapus doa dari ${guestName}...`
        )
        try {
          await deleteComment(row.id)
          toast.success("Doa berhasil dihapus", {
            id: toastId,
            duration: 2000,
          })
          queryClient.invalidateQueries({ queryKey: ["comments"] })
        } catch (error) {
          toast.error("Gagal menghapus doa", {
            id: toastId,
            duration: 3000,
          })
        }
      },
    },
  ]

  return (
    <div className="font-manrope w-full max-w-full space-y-6 overflow-x-hidden">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-sans text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Daftar Doa & Harapan
          </h1>
          <p className="mt-1 text-md text-muted-foreground">
            Kelola ucapan, doa, dan konfirmasi kehadiran dari tamu undangan.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        actions={actions}
        queryKey="comments"
        fetcher={getCommentsData}
        filterColumn="comment"
        filterPlaceholder="Search wishes & comments..."
      />
    </div>
  )
}

export default CommentListView
