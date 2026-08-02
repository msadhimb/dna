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
}

export function CommentList({ comments, surface, border, textPrimary, textSecondary, textMuted }: CommentListProps) {
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
  )
}
