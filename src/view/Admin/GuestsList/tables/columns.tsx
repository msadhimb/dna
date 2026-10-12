import { guestFromList } from "@/helper/guestFormList"
import { Check, Copy, Eye, Pencil, Repeat, Trash, X } from "lucide-react"
import moment from "moment"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export const StatusDot = ({ ok }: { ok: boolean }) => (
  <span
    className={cn(
      "inline-flex size-6 items-center justify-center rounded-full border",
      ok
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
        : "border-border bg-muted/10 text-muted-foreground"
    )}
  >
    {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
  </span>
)

export const columns = ({
  handleCopyLink,
}: {
  handleCopyLink: (id: string) => void
}) => [
  {
    id: "no",
    header: "No",
    size: 64,
    cell: ({ row, table }: { row: any; table: any }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      return (
        <span className="text-xs font-semibold text-muted-foreground">
          {String(pageIndex * pageSize + row.index + 1).padStart(2, "0")}
        </span>
      )
    },
  },
  {
    accessorKey: "full_name",
    header: "Nama Tamu",
    size: 200,
    cell: ({ row }: { row: any }) => (
      <div className="min-w-0">
        <p className="truncate font-serif text-[15px] font-semibold text-foreground">
          {row.original.full_name}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {guestFromList.find((g) => g.id === row.original.guest_from)?.name ??
            row.original.guest_from ??
            "-"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "guest_from",
    header: () => <div className="min-w-40">Tamu Dari</div>,
    cell: ({ row }: { row: any }) => (
      <span className="inline-flex max-w-44 truncate rounded-full border border-wedding-border bg-wedding-surface px-2.5 py-1 text-xs font-medium text-muted">
        {guestFromList.find((g) => g.id === row.original.guest_from)?.name ??
          row.original.guest_from ??
          "-"}
      </span>
    ),
  },
  {
    accessorKey: "mantu_status",
    header: () => <div className="text-center">Mantu</div>,
    size: 90,
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center">
        <StatusDot ok={row.original.mantu_status === true} />
      </div>
    ),
  },
  {
    accessorKey: "unduh_mantu_status",
    header: () => <div className="text-center">Ngunduh</div>,
    size: 90,
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center">
        <StatusDot ok={row.original.unduh_mantu_status === true} />
      </div>
    ),
  },
  {
    accessorKey: "physical_invitation",
    header: () => <div className="text-center">Fisik</div>,
    size: 80,
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center">
        <StatusDot ok={row.original.physical_invitation === true} />
      </div>
    ),
  },
  {
    accessorKey: "sended",
    header: () => <div className="text-center">Dibagikan</div>,
    size: 100,
    cell: ({ row }: { row: any }) => (
      <div className="flex justify-center">
        <StatusDot ok={row.original.sended === true} />
      </div>
    ),
  },
]

export const actions = ({
  handleOpenDetail,
  handleOpenEdit,
  handleShareWa,
  handleToggleSended,
  deleteGuest,
  confirm,
  queryClient,
}: {
  handleOpenDetail: (row: any) => void
  handleOpenEdit: (row: any) => void
  handleShareWa: (row: any) => void
  handleToggleSended: (row: any) => void
  deleteGuest: (id: string) => Promise<void>
  confirm: ({
    title,
    description,
    confirmText,
    cancelText,
    variant,
  }: any) => Promise<boolean>
  queryClient: any
}) => [
  {
    label: "Lihat Detail",
    icon: <Eye className="h-4 w-4" />,
    onClick: (row: any) => handleOpenDetail(row),
  },
  {
    label: "Bagikan WA",
    icon: <FaWhatsapp className="h-4 w-4 text-[#25D366]" />,
    onClick: (row: any) => handleShareWa(row),
  },
  {
    label: "Ubah Status Dibagikan",
    icon: <Repeat className="h-4 w-4" />,
    onClick: (row: any) => handleToggleSended(row),
  },
  {
    label: "Edit Tamu",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (row: any) => handleOpenEdit(row),
  },
  {
    label: "Hapus Tamu",
    icon: <Trash className="h-4 w-4" />,
    destructive: true,
    onClick: async (row: any) => {
      const isConfirmed = await confirm({
        title: "Hapus Tamu Undangan",
        description: `Apakah Anda yakin ingin menghapus tamu ${row.full_name}? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: "Ya, Hapus",
        cancelText: "Batal",
        variant: "destructive",
      })
      if (!isConfirmed) return
      const toastId = toast.loading(`Menghapus ${row.full_name}...`)
      try {
        await deleteGuest(row.id)
        toast.success("Tamu berhasil dihapus", { id: toastId, duration: 2000 })
        queryClient.invalidateQueries({ queryKey: ["guests"] })
      } catch {
        toast.error("Gagal menghapus tamu", { id: toastId })
      }
    },
  },
]
