import { guestFromList } from "@/helper/guestFormList"
import { size } from "lodash"
import { BadgeCheck, Check, Edit, Pencil, Repeat, Trash, X } from "lucide-react"
import moment from "moment"
import { FaWhatsapp } from "react-icons/fa"
import { toast } from "sonner"

export const columns = ({
  handleCopyLink,
  handleToggleSended,
}: {
  handleCopyLink: (id: string) => void
  handleToggleSended?: (row: any) => void
}) => [
  {
    id: "no",
    header: "No",
    size: 64,
    cell: ({ row, table }: { row: any; table: any }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      return <div>{pageIndex * pageSize + row.index + 1}</div>
    },
  },
  {
    accessorKey: "full_name",
    header: "Name",
  },
  {
    accessorKey: "guest_from",
    header: () => <div className="min-w-40">Tamu Dari</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="min-w-40">
          {
            guestFromList.find(
              (guestFrom) => guestFrom.id === row.original.guest_from
            )?.name
          }
        </div>
      )
    },
  },
  {
    accessorKey: "mantu_status",
    header: () => <div className="text-center">Tamu Mantu</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center">
          {row.original.mantu_status === true ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "unduh_mantu_status",
    header: () => <div className="text-center">Tamu Ngunduh Mantu</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center">
          {row.original.unduh_mantu_status === true ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "physical_invitation",
    header: () => <div className="text-center">Undangan Fisik</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center">
          {row.original.physical_invitation === true ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "guest_total",
    header: () => <div className="text-center">Jumlah Tamu</div>,
    cell: ({ row }: { row: any }) => {
      return <div className="text-center">{row.original.guest_total} Orang</div>
    },
  },
  {
    accessorKey: "url",
    header: "Link",
    size: 340,
    cell: ({ row }: { row: any }) => {
      const origin = typeof window !== "undefined" ? window.location.origin : ""
      const id = row.original.id
      return (
        <button
          className="hover:cursor-pointer hover:underline text-left"
          onClick={() => handleCopyLink(id)}
        >
          {`${origin}/${id}`}
        </button>
      )
    },
  },
  {
    accessorKey: "sended",
    header: () => <div className="text-center">Dibagikan</div>,
    cell: ({ row }: { row: any }) => {
      const isSended = row.original.sended === true
      return (
        <div className="flex justify-center">
          {row.original.sended === true ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "checked_in_count",
    header: () => <div className="text-center">Check In</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center">
          {row.original.checked_in_count}
        </div>
      )
    },
  },
  {
    accessorKey: "checked_in_at",
    size: 200,
    header: () => <div className="text-center">Waktu Check In</div>,
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex justify-center">
          {row.original.checked_in_at
            ? moment(row.original.checked_in_at).format("YYYY-MM-DD HH:mm:ss")
            : "-"}
        </div>
      )
    },
  },
]

export const actions = ({
  handleOpenEdit,
  handleShareWa,
  handleToggleSended,
  deleteGuest,
  confirm,
  queryClient,
}: {
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
    label: "Bagikan",
    icon: <FaWhatsapp className="h-4 w-4 text-[#25D366]" />,
    onClick: (row: any) => {
      handleShareWa(row)
    },
  },
  {
    label: "Ubah Status Dibagikan",
    icon: <Repeat className="h-4 w-4" />,
    onClick: (row: any) => {
      handleToggleSended(row)
    },
  },
  {
    label: "Edit Tamu",
    icon: <Pencil className="h-4 w-4" />,
    onClick: (row: any) => {
      handleOpenEdit(row)
    },
  },
  {
    label: "Delete Guest",
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

      const toastId = toast.loading(`Sedang menghapus tamu ${row.full_name}...`)
      try {
        await deleteGuest(row.id)
        toast.success("Tamu berhasil dihapus", {
          id: toastId,
          duration: 2000,
        })
        queryClient.invalidateQueries({ queryKey: ["guests"] })
      } catch (error) {
        toast.error("Gagal menghapus tamu", {
          id: toastId,
          duration: 3000,
        })
      }
    },
  },
]
