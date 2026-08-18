export type Attendance = "hadir" | "tidak_hadir" | "ragu"

export interface Comment {
  id: string
  guest_id: string
  name: string
  comment: string
  attendance: Attendance
  created_at: string
  updated_at?: string | null
}

export interface CommentInput {
  guest_id: string
  name: string
  comment: string
  attendance: Attendance
}
