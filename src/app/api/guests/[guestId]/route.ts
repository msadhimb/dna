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

const ALLOWED_GUEST_FROM = new Set([
  "devis_family_neighbor",
  "devis_father",
  "devis_mother",
  "pagar_ayu",
  "adhim_family",
  "adhim_friends",
  "general",
])

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const rate = checkRateLimit(request, { keyPrefix: "guests-id-get", limit: 60, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await getAdmin()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  const { guestId } = await params
  if (!isValidUUID(guestId)) return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const { data, error } = await client
    .from("guests")
    .select(FIELDS)
    .eq("id", guestId)
    .maybeSingle()
  if (error) {
    logServerError("GET /api/guests/[id]", error)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!data) return applySecurityHeaders(safeErrorResponse("Tamu tidak ditemukan", 404))
  return applySecurityHeaders(NextResponse.json(data))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const rate = checkRateLimit(request, { keyPrefix: "guests-id-patch", limit: 30, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await getAdmin()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  const { guestId } = await params
  if (!isValidUUID(guestId)) return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const body = await request.json().catch(() => null)
  const payload: Record<string, unknown> = {}
  if (body?.full_name !== undefined) {
    const full_name = String(body.full_name).trim().slice(0, 100)
    if (!full_name || full_name.length < 2) return applySecurityHeaders(safeErrorResponse("Nama tamu wajib diisi (2-100 karakter)", 400))
    payload.full_name = full_name
  }
  if (body?.guest_from !== undefined) {
    const gf = String(body.guest_from).trim()
    if (gf && !ALLOWED_GUEST_FROM.has(gf)) return applySecurityHeaders(safeErrorResponse("guest_from tidak valid", 400))
    payload.guest_from = gf || null
  }
  if (body?.guest_total !== undefined) {
    if (!Number.isInteger(body.guest_total) || body.guest_total < 0 || body.guest_total > 100)
      return applySecurityHeaders(safeErrorResponse("Jumlah tamu harus berupa angka bulat 0-100", 400))
    payload.guest_total = body.guest_total
  }
  if (!Object.keys(payload).length) {
    // also allow boolean toggles
    if (typeof body?.mantu_status === "boolean") payload.mantu_status = body.mantu_status
    if (typeof body?.unduh_mantu_status === "boolean") payload.unduh_mantu_status = body.unduh_mantu_status
    if (!Object.keys(payload).length) return applySecurityHeaders(safeErrorResponse("Tidak ada data yang diubah", 400))
  } else {
    if (typeof body?.mantu_status === "boolean")
      payload.mantu_status = body.mantu_status
    if (typeof body?.unduh_mantu_status === "boolean")
      payload.unduh_mantu_status = body.unduh_mantu_status
  }

  const { data, error } = await client
    .from("guests")
    .update(payload)
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()
  if (error) {
    logServerError("PATCH /api/guests/[id]", error)
    return applySecurityHeaders(internalErrorResponse())
  }
  if (!data) return applySecurityHeaders(safeErrorResponse("Tamu tidak ditemukan", 404))
  return applySecurityHeaders(NextResponse.json(data))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const rate = checkRateLimit(request, { keyPrefix: "guests-id-delete", limit: 20, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await getAdmin()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  const { guestId } = await params
  if (!isValidUUID(guestId)) return applySecurityHeaders(safeErrorResponse("ID tidak valid", 400))
  const { error } = await client.from("guests").delete().eq("id", guestId)
  if (error) {
    logServerError("DELETE /api/guests/[id]", error)
    return applySecurityHeaders(internalErrorResponse())
  }
  return applySecurityHeaders(NextResponse.json({ success: true }))
}
