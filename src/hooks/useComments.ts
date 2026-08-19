import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import type { Comment, CommentInput } from "@/types/comment"

const PAGE_SIZE = 10

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.error ?? "Gagal memproses ucapan")
  return body
}

export function useComments(guestId: string | undefined) {
  const queryClient = useQueryClient()
  const commentsKey = ["comments", guestId] as const

  const comments = useInfiniteQuery<Comment[]>({
    queryKey: commentsKey,
    enabled: Boolean(guestId),
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      request(
        `/api/comments?guest_id=${encodeURIComponent(guestId ?? "")}&limit=${PAGE_SIZE}&offset=${pageParam}`
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.length * PAGE_SIZE : undefined,
  })

  const createComment = useMutation({
    mutationFn: (input: Omit<CommentInput, "guest_id">) =>
      request<Comment>("/api/comments", {
        method: "POST",
        body: JSON.stringify({ ...input, guest_id: guestId }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
  })

  const updateComment = useMutation({
    mutationFn: ({ id, ...input }: Partial<CommentInput> & { id: string }) =>
      request<Comment>(`/api/comments/${id}?guest_id=${guestId}`, {
        method: "PATCH",
        body: JSON.stringify({ ...input, guest_id: guestId }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
  })

  const deleteComment = useMutation({
    mutationFn: (id: string) =>
      request<{ success: true }>(`/api/comments/${id}?guest_id=${guestId}`, {
        method: "DELETE",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
  })

  return {
    ...comments,
    data: comments.data?.pages.flat() ?? [],
    createComment,
    updateComment,
    deleteComment,
  }
}
