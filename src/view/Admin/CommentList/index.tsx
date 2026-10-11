"use client"

import { useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/DataTable"
import AdminPageHeader from "@/components/AdminPageHeader"
import { useConfirm } from "@/components/ConfirmDialog/store"
import useCommentsList from "./store"
import { commentActions, commentColumns } from "./tables/columns"

const CommentListView = () => {
  const { getCommentsData, deleteComment } = useCommentsList()
  const queryClient = useQueryClient()
  const confirm = useConfirm()

  return (
    <div className="w-full max-w-full space-y-6 overflow-x-hidden font-manrope">
      <AdminPageHeader
        title="Doa & Harapan"
        description="Kelola ucapan, doa, dan konfirmasi kehadiran dari tamu undangan."
      />
      <DataTable
        columns={commentColumns}
        actions={commentActions({ deleteComment, confirm, queryClient })}
        queryKey="comments"
        fetcher={getCommentsData}
        filterColumn="comment"
        filterPlaceholder="Cari nama atau ucapan..."
        actionsColumnWidth={90}
      />
    </div>
  )
}

export default CommentListView
