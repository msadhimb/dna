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
  
  surface?: string
  
  border?: string
  
  textPrimary?: string
  
  textSecondary?: string
  
  textMuted?: string
  
  borderAccent?: string
  
  accent?: string
  
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
      <Card className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wedding-accent/10 text-wedding-accent">
          ✦
        </div>
        <p className="font-sans text-base font-medium text-wedding-text-secondary">
          Belum ada ucapan
        </p>
        <p className="max-w-sm font-sans text-sm text-wedding-text-muted">
          Jadilah yang pertama menulis ucapan dan doa untuk Devi &amp; Adhim.
        </p>
        {hasMore && (
          <button
            onClick={onLoadMore}
            className="mt-2 text-xs font-semibold tracking-[0.2em] uppercase text-wedding-accent hover:underline"
          >
            Muat ulang
          </button>
        )}
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
      <div ref={loadMoreRef} className="flex min-h-10 flex-col items-center justify-center gap-3">
        {isLoadingMore && (
          <p className="font-sans text-xs text-muted-foreground" role="status" aria-live="polite">
            Memuat ucapan...
          </p>
        )}
        {hasMore && !isLoadingMore && (
          <button
            onClick={onLoadMore}
            className="rounded-full border border-wedding-border px-5 py-2 font-sans text-xs font-semibold tracking-[0.15em] uppercase text-wedding-text-secondary transition hover:bg-wedding-surface"
          >
            Muat lebih banyak
          </button>
        )}
      </div>
    </>
  )
}
