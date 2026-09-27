"use client"

import { useEffect, useRef } from "react"
import { Loader2, MessagesSquare } from "lucide-react"
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

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" aria-hidden="true">
      {[0, 1].map((i) => (
        <Card key={i} withTopLine={false} withCorners={false} className="gap-4 p-5 md:p-6">
          <div className="flex animate-pulse items-center gap-3">
            <span className="h-10 w-10 shrink-0 rounded-full bg-wedding-text-muted/20" />
            <div className="flex flex-1 flex-col gap-2">
              <span className="h-4 w-2/5 rounded-full bg-wedding-text-muted/20" />
              <span className="h-3 w-1/4 rounded-full bg-wedding-text-muted/15" />
            </div>
          </div>
          <div className="flex animate-pulse flex-col gap-2">
            <span className="h-3 w-full rounded-full bg-wedding-text-muted/15" />
            <span className="h-3 w-4/5 rounded-full bg-wedding-text-muted/15" />
          </div>
        </Card>
      ))}
    </div>
  )
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

  if (comments.length === 0 && !isLoadingMore) {
    return (
      <Card
        withTopLine={false}
        withCorners={false}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wedding-accent/10">
          <MessagesSquare className="h-5 w-5 text-wedding-accent" />
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="font-signature text-2xl font-bold text-wedding-text-primary">
            Belum ada ucapan
          </p>
          <p className="font-sans text-xs text-wedding-text-secondary">
            Jadilah yang pertama menulis doa terbaik Anda
          </p>
        </div>
      </Card>
    )
  }

  return (
    <>
      {comments.length === 0 ? (
        <LoadingSkeleton />
      ) : (
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
      )}
      <div ref={loadMoreRef} className="flex min-h-10 items-center justify-center">
        {isLoadingMore &&
          (comments.length === 0 ? null : (
            <p className="flex items-center gap-2 font-sans text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Memuat ucapan...
            </p>
          ))}
      </div>
    </>
  )
}
