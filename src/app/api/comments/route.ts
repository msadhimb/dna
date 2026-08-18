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

function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

async function supabase() {
  return createClient(await cookies())
}

export async function GET(request: NextRequest) {
  const guestId = request.nextUrl.searchParams.get("guest_id")
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit") ?? "10"), 1),
    50
  )
  const offset = Math.max(Number(request.nextUrl.searchParams.get("offset") ?? "0"), 0)
  const client = await supabase()
  let query = client
    .from("comments")
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (guestId) query = query.eq("guest_id", guestId)

  const { data, error: dbError } = await query

  if (dbError) return error(dbError.message, 500)
  return NextResponse.json(
    data?.map((item) => ({
      ...item,
      attendance:
        item.attendance === "attend"
          ? "hadir"
          : item.attendance === "absence"
            ? "tidak_hadir"
            : "ragu",
    })) ?? []
  )
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const { guest_id: guestId, name, comment, attendance } = body ?? {}

  if (!guestId || typeof name !== "string" || name.trim().length < 2)
    return error("Nama minimal 2 karakter")
  if (typeof comment !== "string" || comment.trim().length < 5)
    return error("Ucapan minimal 5 karakter")
  if (!ATTENDANCE.includes(attendance))
    return error("Status kehadiran tidak valid")

  const client = await supabase()
  const { data: guest, error: guestError } = await client
    .from("guests")
    .select("id")
    .eq("id", guestId)
    .maybeSingle()

  if (guestError) return error(guestError.message, 500)
  if (!guest) return error("Tamu tidak ditemukan", 404)

  const { data, error: dbError } = await client
    .from("comments")
    .insert({
      guest_id: guestId,
      name: name.trim(),
      comment: comment.trim(),
      attendance: DB_ATTENDANCE[attendance as Attendance],
    })
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .single()

  if (dbError) return error(dbError.message, 500)
  return NextResponse.json(
    {
      ...data,
      attendance:
        data.attendance === "attend"
          ? "hadir"
          : data.attendance === "absence"
            ? "tidak_hadir"
            : "ragu",
    },
    { status: 201 }
  )
}
