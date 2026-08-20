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
  const isAdminQuery = request.nextUrl.searchParams.has("page")
  const limit = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("limit") ?? "10"), 1),
    50
  )
  const offset = Math.max(
    Number(request.nextUrl.searchParams.get("offset") ?? "0"),
    0
  )
  const client = await supabase()
  let query = client
    .from("comments")
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (guestId) query = query.eq("guest_id", guestId)

  if (isAdminQuery) {
    const { data: claims } = await client.auth.getClaims()
    if (!claims?.claims) return error("Unauthorized", 401)
    const page = Math.max(
      Number(request.nextUrl.searchParams.get("page") ?? "1"),
      1
    )
    const pageSize = Math.min(
      Math.max(Number(request.nextUrl.searchParams.get("pageSize") ?? "20"), 1),
      100
    )
    const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""
    const requestedSort =
      request.nextUrl.searchParams.get("sortBy") ?? "created_at"
    const sortBy = [
      "created_at",
      "updated_at",
      "name",
      "comment",
      "attendance",
    ].includes(requestedSort)
      ? requestedSort
      : "created_at"
    const ascending = request.nextUrl.searchParams.get("sortDir") === "asc"
    let adminQuery = client
      .from("comments")
      .select(
        "id, guest_id, name, comment, attendance, created_at, updated_at",
        { count: "exact" }
      )
      .order(sortBy, { ascending })
    if (search)
      adminQuery = adminQuery.or(
        `name.ilike.%${search}%,comment.ilike.%${search}%`
      )
    const from = (page - 1) * pageSize
    const {
      data,
      error: adminError,
      count,
    } = await adminQuery.range(from, from + pageSize - 1)
    if (adminError) return error(adminError.message, 500)

    const guestIds = [
      ...new Set((data ?? []).map((item) => item.guest_id).filter(Boolean)),
    ]
    const guestsById = new Map<
      string,
      { id: string; full_name: string | null }
    >()
    if (guestIds.length) {
      const { data: guests, error: guestsError } = await client
        .from("guests")
        .select("id, full_name")
        .in("id", guestIds)
      if (guestsError) return error(guestsError.message, 500)
      guests?.forEach((guest) => guestsById.set(guest.id, guest))
    }
    const comments = (data ?? []).map((item) => ({
      ...item,
      guest: guestsById.get(item.guest_id) ?? null,
      arrival_status:
        item.attendance === "attend"
          ? "attending"
          : item.attendance === "absence"
            ? "not_attending"
            : "maybe",
    }))
    const totalItems = count ?? 0
    return NextResponse.json({
      data: { comments },
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      },
    })
  }

  if (!guestId) return error("guest_id wajib diisi")
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
