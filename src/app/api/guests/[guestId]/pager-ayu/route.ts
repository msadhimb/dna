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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ guestId: string }> }
) {
  const client = await getAdmin()
  if (!client) return bad("Unauthorized", 401)

  const { guestId } = await params
  const body = await request.json().catch(() => null)

  if (body?.guest_total === undefined) return bad("guest_total wajib diisi")
  if (!Number.isInteger(body.guest_total) || body.guest_total < 0)
    return bad("Jumlah tamu harus berupa angka bulat positif")

  const { data, error } = await client
    .from("guests")
    .update({ guest_total: body.guest_total })
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()

  if (error) return bad(error.message, 500)
  if (!data) return bad("Tamu tidak ditemukan", 404)

  return NextResponse.json(data)
}
