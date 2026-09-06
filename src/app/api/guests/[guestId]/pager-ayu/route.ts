import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import {
  checkRateLimit,
  isValidUUID,
  getClaimEmail,
  isEmailAllowed,
  safeErrorResponse,
  internalErrorResponse,
  logServerError,
  applySecurityHeaders,
} from "@/lib/security"

const FIELDS =
  "id, full_name, mantu_status, unduh_mantu_status, guest_from, guest_total"

async function getAdmin() {
  const client = createClient(await cookies())
  const { data } = await client.auth.getClaims()
  if (!data?.claims) return null
  const email = getClaimEmail(data.claims)
  if (!isEmailAllowed(email)) return null
  return client
}

function bad(message: string, status = 400) {
  return safeErrorResponse(message, status)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const rate = checkRateLimit(request, { keyPrefix: "pager-ayu", limit: 30, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await getAdmin()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))

  const { guestId } = await params
  if (!isValidUUID(guestId)) return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const body = await request.json().catch(() => null)

  if (body?.guest_total === undefined) return applySecurityHeaders(safeErrorResponse("guest_total wajib diisi", 400))
  if (!Number.isInteger(body.guest_total) || body.guest_total < 0 || body.guest_total > 100)
    return applySecurityHeaders(safeErrorResponse("Jumlah tamu harus berupa angka bulat 0-100", 400))

  const { data, error } = await client
    .from("guests")
    .update({ guest_total: body.guest_total })
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()

  if (error) {
    logServerError("PATCH /api/guests/[id]/pager-ayu", error)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!data) return applySecurityHeaders(safeErrorResponse("Tamu tidak ditemukan", 404))

  return applySecurityHeaders(NextResponse.json(data))
}
