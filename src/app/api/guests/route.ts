import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import {
  checkRateLimit,
  sanitizeSearchParam,
  getClaimEmail,
  isEmailAllowed,
  safeErrorResponse,
  internalErrorResponse,
  logServerError,
  applySecurityHeaders,
} from "@/lib/security"

const FIELDS =
  "id, full_name, guest_from, mantu_status, unduh_mantu_status, guest_total"

const ALLOWED_GUEST_FROM = new Set([
  "devis_family_neighbor",
  "devis_father",
  "devis_mother",
  "pagar_ayu",
  "adhim_family",
  "adhim_friends",
  "general",
])

async function adminClient() {
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

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, { keyPrefix: "guests-get", limit: 60, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await adminClient()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))

  const page = Math.max(
    Number(request.nextUrl.searchParams.get("page") ?? "1"),
    1
  )
  const pageSize = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("pageSize") ?? "20"), 1),
    100
  )
  const search = sanitizeSearchParam(request.nextUrl.searchParams.get("search") ?? "", 100)
  const guestFromRaw = sanitizeSearchParam(request.nextUrl.searchParams.get("guest_from") ?? "", 50)
  const guestFrom = ALLOWED_GUEST_FROM.has(guestFromRaw) ? guestFromRaw : ""
  const mantuStatusParam = request.nextUrl.searchParams.get("mantu_status")
  const unduhMantuStatusParam =
    request.nextUrl.searchParams.get("unduh_mantu_status")
  const allowedSort = ["full_name", "id"]
  const requestedSort =
    request.nextUrl.searchParams.get("sortBy") ?? "full_name"
  const sortBy = allowedSort.includes(requestedSort)
    ? requestedSort
    : "full_name"
  const ascending = request.nextUrl.searchParams.get("sortDir") === "asc"

  let query = client
    .from("guests")
    .select(FIELDS, { count: "exact" })
    .order(sortBy, { ascending })
  if (search) {
    const escaped = search.replace(/[%_\\]/g, "\\$&")
    query = query.ilike("full_name", `%${escaped}%`)
  }
  if (guestFrom) query = query.eq("guest_from", guestFrom)
  if (mantuStatusParam === "true") query = query.eq("mantu_status", true)
  if (mantuStatusParam === "false") query = query.eq("mantu_status", false)
  if (unduhMantuStatusParam === "true")
    query = query.eq("unduh_mantu_status", true)
  if (unduhMantuStatusParam === "false")
    query = query.eq("unduh_mantu_status", false)
  const from = (page - 1) * pageSize
  const { data, error, count } = await query.range(from, from + pageSize - 1)
  if (error) {
    logServerError("GET /api/guests", error)
    return applySecurityHeaders(internalErrorResponse())
  }

  const totalItems = count ?? 0
  return applySecurityHeaders(
    NextResponse.json({
      data: { guests: data ?? [] },
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
      },
    })
  )
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, { keyPrefix: "guests-post", limit: 20, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const client = await adminClient()
  if (!client) return applySecurityHeaders(safeErrorResponse("Unauthorized", 401))
  const body = await request.json().catch(() => null)
  const rawGuests = Array.isArray(body) ? body : (body?.guests ?? [body])
  if (!rawGuests.length || rawGuests.length > 100) return applySecurityHeaders(safeErrorResponse(rawGuests.length > 100 ? "Maksimal 100 tamu per request" : "Data tamu kosong", 400))

  let inserted = 0
  let updated = 0
  const ids: string[] = []
  for (const input of rawGuests) {
    const full_name = String(input?.full_name ?? "").trim().slice(0, 100)
    if (!full_name || full_name.length < 2) continue
    const guestFromRaw = typeof input?.guest_from === "string" ? input.guest_from.trim().slice(0, 50) : ""
    const guest_from = ALLOWED_GUEST_FROM.has(guestFromRaw) ? guestFromRaw : null
    const payload: Record<string, unknown> = { full_name }
    if (guest_from) payload.guest_from = guest_from
    if (Number.isInteger(input?.guest_total) && input.guest_total >= 0 && input.guest_total <= 100)
      payload.guest_total = input.guest_total

    if (typeof input.mantu_status === "boolean")
      payload.mantu_status = input.mantu_status

    if (typeof input.unduh_mantu_status === "boolean")
      payload.unduh_mantu_status = input.unduh_mantu_status
    const { data: existing, error: findError } = await client
      .from("guests")
      .select("id")
      .eq("full_name", full_name)
      .maybeSingle()
    if (findError) {
      logServerError("POST /api/guests lookup", findError)
      return applySecurityHeaders(internalErrorResponse())
    }
    const result = existing
      ? await client
          .from("guests")
          .update(payload)
          .eq("id", existing.id)
          .select("id")
          .single()
      : await client.from("guests").insert(payload).select("id").single()
    if (result.error) {
      logServerError("POST /api/guests write", result.error)
      return applySecurityHeaders(internalErrorResponse())
    }
    if (result.data?.id) ids.push(result.data.id)
    if (existing) updated++
    else inserted++
  }
  return applySecurityHeaders(
    NextResponse.json({ success: true, inserted, updated, ids }, { status: 201 })
  )
}
