import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const FIELDS =
  "id, full_name, mantu_status, unduh_mantu_status, guest_from, guest_total"

async function getAdmin() {
  const client = createClient(await cookies())
  const { data } = await client.auth.getClaims()
  return data?.claims ? client : null
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const client = await getAdmin()
  if (!client) return bad("Unauthorized", 401)
  const { guestId } = await params
  const { data, error } = await client
    .from("guests")
    .select(FIELDS)
    .eq("id", guestId)
    .maybeSingle()
  if (error) return bad(error.message, 500)
  if (!data) return bad("Tamu tidak ditemukan", 404)
  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const client = await getAdmin()
  if (!client) return bad("Unauthorized", 401)
  const { guestId } = await params
  const body = await request.json().catch(() => null)
  const payload: any = {}
  if (body?.full_name !== undefined) {
    const full_name = String(body.full_name).trim()
    if (!full_name) return bad("Nama tamu wajib diisi")
    payload.full_name = full_name
  }
  if (body?.guest_from !== undefined) payload.guest_from = body.guest_from
  if (body?.guest_total !== undefined) {
    if (!Number.isInteger(body.guest_total) || body.guest_total < 0)
      return bad("Jumlah tamu harus berupa angka bulat positif")
    payload.guest_total = body.guest_total
  }
  if (!Object.keys(payload).length) return bad("Tidak ada data yang diubah")
  if (typeof body?.mantu_status === "boolean")
    payload.mantu_status = body.mantu_status
  if (typeof body?.unduh_mantu_status === "boolean")
    payload.unduh_mantu_status = body.unduh_mantu_status

  const { data, error } = await client
    .from("guests")
    .update(payload)
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()
  if (error) return bad(error.message, 500)
  if (!data) return bad("Tamu tidak ditemukan", 404)
  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const client = await getAdmin()
  if (!client) return bad("Unauthorized", 401)
  const { guestId } = await params
  const { error } = await client.from("guests").delete().eq("id", guestId)
  if (error) return bad(error.message, 500)
  return NextResponse.json({ success: true })
}
