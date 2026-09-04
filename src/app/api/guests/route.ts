import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const FIELDS =
  "id, full_name, guest_from, mantu_status, unduh_mantu_status, guest_total"

async function adminClient() {
  const client = createClient(await cookies())
  const { data } = await client.auth.getClaims()
  return data?.claims ? client : null
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  const client = await adminClient()
  if (!client) return bad("Unauthorized", 401)

  const page = Math.max(
    Number(request.nextUrl.searchParams.get("page") ?? "1"),
    1
  )
  const pageSize = Math.min(
    Math.max(Number(request.nextUrl.searchParams.get("pageSize") ?? "20"), 1),
    100
  )
  const search = request.nextUrl.searchParams.get("search")?.trim() ?? ""
  const guestFrom = request.nextUrl.searchParams.get("guest_from")?.trim() ?? ""
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
  if (search) query = query.ilike("full_name", `%${search}%`)
  if (guestFrom) query = query.eq("guest_from", guestFrom)
  if (mantuStatusParam === "true") query = query.eq("mantu_status", true)
  if (mantuStatusParam === "false") query = query.eq("mantu_status", false)
  if (unduhMantuStatusParam === "true")
    query = query.eq("unduh_mantu_status", true)
  if (unduhMantuStatusParam === "false")
    query = query.eq("unduh_mantu_status", false)
  const from = (page - 1) * pageSize
  const { data, error, count } = await query.range(from, from + pageSize - 1)
  if (error) return bad(error.message, 500)

  const totalItems = count ?? 0
  return NextResponse.json({
    data: { guests: data ?? [] },
    pagination: {
      page,
      pageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / pageSize)),
    },
  })
}

export async function POST(request: NextRequest) {
  const client = await adminClient()
  if (!client) return bad("Unauthorized", 401)
  const body = await request.json().catch(() => null)
  const guests = Array.isArray(body) ? body : (body?.guests ?? [body])
  if (!guests.length) return bad("Data tamu kosong")

  let inserted = 0
  let updated = 0
  const ids: string[] = []
  for (const input of guests) {
    const full_name = String(input?.full_name ?? "").trim()
    if (!full_name) continue
    const payload: any = { full_name, guest_from: input?.guest_from }
    if (Number.isInteger(input?.guest_total) && input.guest_total >= 0)
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
    if (findError) return bad(findError.message, 500)
    const result = existing
      ? await client
          .from("guests")
          .update(payload)
          .eq("id", existing.id)
          .select("id")
          .single()
      : await client.from("guests").insert(payload).select("id").single()
    if (result.error) return bad(result.error.message, 500)
    if (result.data?.id) ids.push(result.data.id)
    if (existing) updated++
    else inserted++
  }
  return NextResponse.json(
    { success: true, inserted, updated, ids },
    { status: 201 }
  )
}
