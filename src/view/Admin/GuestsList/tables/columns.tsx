import { Check, Pencil, Trash, X } from "lucide-react"
import { toast } from "sonner"

export const columns = ({
  handleCopyLink,
}: {
  handleCopyLink: (id: string) => void
}) => [
  {
    accessorKey: "full_name",
    header: "Name",
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
    header: () => <div className="text-center">Tamu Unduh Mantu</div>,
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
    accessorKey: "url",
    header: "Link",
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
]

export const actions = ({
  handleOpenEdit,
  deleteGuest,
  confirm,
  queryClient,
}: {
  handleOpenEdit: (row: any) => void
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
