import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import type { Attendance } from "@/types/comment"

const ATTENDANCE: Attendance[] = ["hadir", "tidak_hadir", "ragu"]
const DB_ATTENDANCE = {
  hadir: "attend",
  tidak_hadir: "absence",
  ragu: "maybe",
} as const

function toUiComment(comment: Record<string, unknown>) {
  return {
    ...comment,
    attendance:
      comment.attendance === "attend"
        ? "hadir"
        : comment.attendance === "absence"
          ? "tidak_hadir"
          : "ragu",
  }
}

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params
  const client = createClient(await cookies())
  const { data, error: dbError } = await client
    .from("comments")
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .eq("id", commentId)
    .maybeSingle()

  if (dbError) return error(dbError.message, 500)
  if (!data) return error("Ucapan tidak ditemukan", 404)
  return NextResponse.json(toUiComment(data))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params
  const guestId = request.nextUrl.searchParams.get("guest_id")
  if (!guestId) return error("guest_id wajib diisi")

  const body = await request.json().catch(() => null)
  const updates: Record<string, string> = {}

  if (body?.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 2)
      return error("Nama minimal 2 karakter")
    updates.name = body.name.trim()
  }
  if (body?.comment !== undefined) {
    if (typeof body.comment !== "string" || body.comment.trim().length < 5)
      return error("Ucapan minimal 5 karakter")
    updates.comment = body.comment.trim()
  }
  if (body?.attendance !== undefined) {
    if (!ATTENDANCE.includes(body.attendance))
      return error("Status kehadiran tidak valid")
    updates.attendance = DB_ATTENDANCE[body.attendance as Attendance]
  }
  if (!Object.keys(updates).length) return error("Tidak ada data untuk diubah")

  const client = createClient(await cookies())
  const { data, error: dbError } = await client
    .from("comments")
    .update(updates)
    .eq("id", commentId)
    .eq("guest_id", guestId)
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .maybeSingle()

  if (dbError) return error(dbError.message, 500)
  if (!data) return error("Ucapan tidak ditemukan", 404)
  return NextResponse.json(toUiComment(data))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params
  const guestId = request.nextUrl.searchParams.get("guest_id")
  if (!guestId) return error("guest_id wajib diisi")

  const client = createClient(await cookies())
  const query = client
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("guest_id", guestId)
  const { error: dbError } = await query

  if (dbError) return error(dbError.message, 500)
  return NextResponse.json({ success: true })
}
