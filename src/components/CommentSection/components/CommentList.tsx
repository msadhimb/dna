"use client"

import { useEffect, useRef } from "react"
import { CommentCard } from "./CommentCard"

interface Comment {
  id: string
  name: string
  message: string
  attendance: "hadir" | "tidak_hadir" | "ragu"
  date: string
}

interface CommentListProps {
  comments: Comment[]
  surface: string
  border: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

export function CommentList({
  comments,
  surface,
  border,
  textPrimary,
  textSecondary,
  textMuted,
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
      <div className="flex flex-col items-center gap-5 py-20">
        <p className="font-sans text-base" style={{ color: textSecondary }}>
          Jadilah yang pertama menulis ucapan
        </p>
      </div>
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
            surface={surface}
            border={border}
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            textMuted={textMuted}
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
