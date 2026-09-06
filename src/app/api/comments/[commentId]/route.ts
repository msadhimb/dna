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
  return safeErrorResponse(message, status)
}

function isAdmin(claims: unknown): boolean {
  return isEmailAllowed(getClaimEmail(claims))
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params
  if (!isValidUUID(commentId))
    return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const client = createClient(await cookies())
  const { data, error: dbError } = await client
    .from("comments")
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .eq("id", commentId)
    .maybeSingle()

  if (dbError) {
    logServerError("GET /api/comments/[id]", dbError)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!data)
    return applySecurityHeaders(
      safeErrorResponse("Ucapan tidak ditemukan", 404)
    )
  return applySecurityHeaders(NextResponse.json(toUiComment(data)))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const rate = checkRateLimit(request, {
    keyPrefix: "comments-patch",
    limit: 10,
    windowMs: 60_000,
  })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const { commentId } = await params
  if (!isValidUUID(commentId))
    return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const guestId = request.nextUrl.searchParams.get("guest_id")
  if (guestId && !isValidUUID(guestId))
    return applySecurityHeaders(safeErrorResponse("guest_id tidak valid", 400))
  const client = createClient(await cookies())
  const { data: claims } = await client.auth.getClaims()
  const isAdminUser = !!claims?.claims && isAdmin(claims.claims)

  // HMAC guest ownership verification
  if (guestId) {
    const token = extractGuestToken(request)
    if (!token || !verifyGuestToken(guestId, token)) {
      return applySecurityHeaders(
        safeErrorResponse("Token tamu tidak valid.", 403)
      )
    }
  } else if (!isAdminUser) {
    return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  }

  const body = await request.json().catch(() => null)
  const updates: Record<string, string> = {}

  if (body?.name !== undefined) {
    if (typeof body.name !== "string" || !isValidGuestName(body.name))
      return applySecurityHeaders(
        safeErrorResponse("Nama minimal 2 dan maksimal 100 karakter.", 400)
      )
    updates.name = body.name.trim().slice(0, 100)
  }
  if (body?.comment !== undefined) {
    if (typeof body.comment !== "string" || !isValidComment(body.comment))
      return applySecurityHeaders(
        safeErrorResponse("Ucapan minimal 5 dan maksimal 1000 karakter.", 400)
      )
    updates.comment = body.comment.trim().slice(0, 1000)
  }
  if (body?.attendance !== undefined) {
    if (!ATTENDANCE.includes(body.attendance))
      return applySecurityHeaders(
        safeErrorResponse("Status kehadiran tidak valid.", 400)
      )
    updates.attendance = DB_ATTENDANCE[body.attendance as Attendance]
  }
  if (!Object.keys(updates).length)
    return applySecurityHeaders(
      safeErrorResponse("Tidak ada data untuk diubah", 400)
    )

  let updateQuery = client.from("comments").update(updates).eq("id", commentId)
  if (guestId) updateQuery = updateQuery.eq("guest_id", guestId)
  const { data, error: dbError } = await updateQuery
    .select("id, guest_id, name, comment, attendance, created_at, updated_at")
    .maybeSingle()

  if (dbError) {
    logServerError("PATCH /api/comments/[id]", dbError)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!data)
    return applySecurityHeaders(
      safeErrorResponse("Ucapan tidak ditemukan", 404)
    )
  return applySecurityHeaders(NextResponse.json(toUiComment(data)))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const rate = checkRateLimit(request, {
    keyPrefix: "comments-delete",
    limit: 10,
    windowMs: 60_000,
  })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const { commentId } = await params
  if (!isValidUUID(commentId))
    return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const guestId = request.nextUrl.searchParams.get("guest_id")
  if (guestId && !isValidUUID(guestId))
    return applySecurityHeaders(safeErrorResponse("guest_id tidak valid", 400))
  const client = createClient(await cookies())
  const { data: claims } = await client.auth.getClaims()
  const isAdminUser = !!claims?.claims && isAdmin(claims.claims)
  if (guestId) {
    const token = extractGuestToken(request)
    if (!token || !verifyGuestToken(guestId, token)) {
      return applySecurityHeaders(
        safeErrorResponse("Token tamu tidak valid.", 403)
      )
    }
  } else if (!isAdminUser) {
    return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  }

  let query = client.from("comments").delete().eq("id", commentId)
  if (guestId) query = query.eq("guest_id", guestId)
  const { error: dbError } = await query

  if (dbError) {
    logServerError("DELETE /api/comments/[id]", dbError)
    return applySecurityHeaders(internalErrorResponse())
  }
  return applySecurityHeaders(NextResponse.json({ success: true }))
}
