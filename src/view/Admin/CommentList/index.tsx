"use client"

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
      id: "guest_name",
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
      cell: ({ row }) => {
        const status = row.getValue("arrival_status") as string
        return (
          <div className="flex justify-center">
            <span
              className={`text-[10px] font-forum tracking-widest uppercase px-2.5 py-1 rounded-sm border font-medium ${
                status === "attending"
                  ? "text-[#A8C5A0] border-[#A8C5A0]/30 bg-[#A8C5A0]/10"
                  : status === "not_attending"
                    ? "text-[#D4A8A8] border-[#D4A8A8]/30 bg-[#D4A8A8]/10"
                    : "text-[#D2B48C] border-[#D2B48C]/30 bg-[#D2B48C]/10"
              }`}
            >
              {status === "attending"
                ? "Hadir"
                : status === "not_attending"
                  ? "Tidak Hadir"
                  : "Mungkin"}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Waktu Kirim",
      size: 180,
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return (
          <span className="text-xs text-muted-foreground">
            {moment(date).format("DD MMMM YYYY HH:mm")}
          </span>
        )
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
    <div className="font-manrope w-full max-w-full overflow-x-hidden">
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
