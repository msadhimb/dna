"use client"

import { useEffect, useRef } from "react"
import { CommentCard } from "./CommentCard"
import { Card } from "@/components/Card"

interface Comment {
  id: string
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
  date: string
}

interface CommentListProps {
  comments: Comment[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  /** @deprecated — terpusat via Tailwind */
  surface?: string
  /** @deprecated */
  border?: string
  /** @deprecated */
  textPrimary?: string
  /** @deprecated */
  textSecondary?: string
  /** @deprecated */
  textMuted?: string
  /** @deprecated */
  borderAccent?: string
  /** @deprecated */
  accent?: string
  /** @deprecated */
  isDark?: boolean
}

export function CommentList({
  comments,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: CommentListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const target = loadMoreRef.current
    if (!target || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) onLoadMore()
      },
      { rootMargin: "300px" }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, onLoadMore])

  if (comments.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-5 py-14">
        <p className="font-sans text-base text-wedding-text-secondary">
          Jadilah yang pertama menulis ucapan
        </p>
      </Card>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {comments.map((c) => (
          <CommentCard
            key={c.id}
            name={c.name}
            message={c.message}
            attendance={c.attendance}
            date={c.date}
          />
        ))}
      </div>
      <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
        {isLoadingMore && (
          <p className="font-sans text-xs text-muted-foreground">Memuat ucapan...</p>
        )}
      </div>
    </>
  )
}
