import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import type { Attendance } from "@/types/comment"
import {
  checkRateLimit,
  verifyGuestToken,
  extractGuestToken,
  isValidUUID,
  isValidGuestName,
  isValidComment,
  sanitizeSearchParam,
  getClaimEmail,
  isEmailAllowed,
  safeErrorResponse,
  internalErrorResponse,
  logServerError,
  applySecurityHeaders,
} from "@/lib/security"

const ATTENDANCE: Attendance[] = ["hadir", "tidak_hadir", "ragu"]
const DB_ATTENDANCE = {
  hadir: "attend",
  tidak_hadir: "absence",
  ragu: "maybe",
} as const

function error(message: string, status = 400) {
  return safeErrorResponse(message, status)
}

async function supabase() {
  return createClient(await cookies())
}

function requireAdmin(claims: unknown): boolean {
  const email = getClaimEmail(claims)
  return isEmailAllowed(email)
}

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, {
    keyPrefix: "comments-get",
    limit: 60,
    windowMs: 60_000,
  })
  if (!rate.allowed) return applySecurityHeaders(rate.response)

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
  const query = client
    .from("comments")
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (isAdminQuery) {
    const { data: claims } = await client.auth.getClaims()
    if (!claims?.claims || !requireAdmin(claims.claims))
      return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
    const page = Math.max(
      Number(request.nextUrl.searchParams.get("page") ?? "1"),
      1
    )
    const pageSize = Math.min(
      Math.max(Number(request.nextUrl.searchParams.get("pageSize") ?? "20"), 1),
      100
    )
    const search = sanitizeSearchParam(
      request.nextUrl.searchParams.get("search") ?? "",
      100
    )
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
    if (search) {
      const escaped = search.replace(/[%_\\]/g, "\\$&").replace(/[,]/g, "")
      adminQuery = adminQuery.or(
        `name.ilike.%${escaped}%,comment.ilike.%${escaped}%`
      )
    }
    const from = (page - 1) * pageSize
    const {
      data,
      error: adminError,
      count,
    } = await adminQuery.range(from, from + pageSize - 1)
    if (adminError) {
      logServerError("GET /api/comments admin", adminError)
      return applySecurityHeaders(internalErrorResponse())
    }

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
      if (guestsError) {
        logServerError("GET /api/comments guests", guestsError)
        return applySecurityHeaders(internalErrorResponse())
      }
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
    return applySecurityHeaders(
      NextResponse.json({
        data: { comments },
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
        },
      })
    )
  }

  const { data, error: dbError } = await query

  if (dbError) {
    logServerError("GET /api/comments", dbError)
    return applySecurityHeaders(internalErrorResponse())
  }
  return applySecurityHeaders(
    NextResponse.json(
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
  )
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, {
    keyPrefix: "comments-post",
    limit: 5,
    windowMs: 60_000,
  })
  if (!rate.allowed) return applySecurityHeaders(rate.response)

  const body = await request.json().catch(() => null)
  const { guest_id: guestId, name, comment, attendance } = body ?? {}

  if (!guestId || typeof guestId !== "string" || !isValidUUID(guestId))
    return applySecurityHeaders(safeErrorResponse("ID tamu tidak valid.", 400))
  const token = extractGuestToken(request)
  if (!token) {
    return applySecurityHeaders(
      safeErrorResponse("Token tamu tidak valid.", 401)
    )
  }
  if (!verifyGuestToken(guestId, token)) {
    return applySecurityHeaders(
      safeErrorResponse("Token tamu tidak valid.", 403)
    )
  }

  // fail closed if HMAC secret missing — a valid token cannot exist without the secret
  try {
    const { getGuestHmacSecret } = await import("@/lib/security")
    getGuestHmacSecret()
  } catch {
    logServerError("POST /api/comments", "Missing GUEST_HMAC_SECRET")
    return applySecurityHeaders(internalErrorResponse())
  }
  if (typeof name !== "string" || !isValidGuestName(name))
    return applySecurityHeaders(
      safeErrorResponse("Nama minimal 2 dan maksimal 100 karakter.", 400)
    )
  if (typeof comment !== "string" || !isValidComment(comment))
    return applySecurityHeaders(
      safeErrorResponse("Ucapan minimal 5 dan maksimal 1000 karakter.", 400)
    )
  if (!ATTENDANCE.includes(attendance))
    return applySecurityHeaders(
      safeErrorResponse("Status kehadiran tidak valid.", 400)
    )

  const client = await supabase()
  const { data: guest, error: guestError } = await client
    .from("guests")
    .select("id")
    .eq("id", guestId)
    .maybeSingle()

  if (guestError) {
    logServerError("POST /api/comments guest lookup", guestError)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!guest)
    return applySecurityHeaders(safeErrorResponse("Tamu tidak ditemukan", 404))

  const { data, error: dbError } = await client
    .from("comments")
    .insert({
      guest_id: guestId,
      name: name.trim().slice(0, 100),
      comment: comment.trim().slice(0, 1000),
      attendance: DB_ATTENDANCE[attendance as Attendance],
    })
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .single()

  if (dbError) {
    logServerError("POST /api/comments insert", dbError)
    return applySecurityHeaders(internalErrorResponse())
  }
  return applySecurityHeaders(
    NextResponse.json(
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
  )
}
