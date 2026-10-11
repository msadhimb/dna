"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import moment from "moment"
import { toast } from "sonner"
import { AttendanceBadge } from "@/components/AttendanceBadge"

moment.locale("id")

// Kolom tabel Doa & Harapan — gaya kutipan elegan + badge kehadiran.
export const commentColumns: ColumnDef<any>[] = [
  {
    id: "full_name",
    header: "Nama Tamu",
    size: 200,
    accessorFn: (row) => row.guest?.full_name || row.name || "-",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="truncate font-serif text-[15px] font-semibold text-foreground">
          {row.original.name || row.original.guest?.full_name || "-"}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {moment(row.original.created_at).format("DD MMM YYYY • HH:mm")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "comment",
    header: "Pesan Doa & Harapan",
    size: 380,
    cell: ({ row }) => (
      <p className="max-w-100 font-serif text-[15px] leading-relaxed break-words whitespace-normal text-foreground/85 italic">
        “{row.getValue("comment")}”
      </p>
    ),
  },
  {
    accessorKey: "arrival_status",
    header: () => <div className="text-center">Kehadiran</div>,
    size: 130,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <AttendanceBadge status={row.getValue("arrival_status") as string} />
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Waktu Kirim",
    size: 190,
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap text-muted-foreground">
        {moment(row.getValue("created_at") as string).format("dddd, DD MMM YYYY")}
      </span>
    ),
  },
]

export const commentActions = ({
  deleteComment,
  confirm,
  queryClient,
}: {
  deleteComment: (id: string) => Promise<unknown>
  confirm: (args: any) => Promise<boolean>
  queryClient: { invalidateQueries: (args: { queryKey: string[] }) => void }
}) => [
  {
    label: "Hapus",
    icon: <Trash className="h-4 w-4" />,
    destructive: true,
    onClick: async (row: any) => {
      const guestName = row.guest?.full_name || row.name || "Tamu Tanpa Nama"
      const ok = await confirm({
        title: "Hapus Doa & Harapan",
        description: `Hapus ucapan doa dari ${guestName}? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Ya, Hapus",
        cancelText: "Batal",
        variant: "destructive",
      })
      if (!ok) return
      const toastId = toast.loading(`Menghapus doa dari ${guestName}...`)
      try {
        await deleteComment(row.id)
        toast.success("Doa berhasil dihapus", { id: toastId, duration: 2000 })
        queryClient.invalidateQueries({ queryKey: ["comments"] })
      } catch {
        toast.error("Gagal menghapus doa", { id: toastId })
      }
    },
  },
]
