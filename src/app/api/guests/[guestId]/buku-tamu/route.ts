import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const FIELDS =
  "id, full_name, mantu_status, unduh_mantu_status, guest_from, guest_total, checked_in_count, checked_in_at"

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

  // arrived_count = jumlah yang benar-benar datang (realita di pintu).
  // guest_total tetap sebagai patokan undangan dan TIDAK ditimpa di sini.
  // Terima alias guest_total lama agar klien lama tidak rusak.
  const arrived =
    body?.arrived_count !== undefined ? body.arrived_count : body?.guest_total
  if (arrived === undefined) return bad("arrived_count wajib diisi")
  if (!Number.isInteger(arrived) || arrived < 0)
    return bad("Jumlah tamu harus berupa angka bulat positif")

  const { data, error } = await client
    .from("guests")
    .update({
      checked_in_count: arrived,
      checked_in_at: new Date().toISOString(),
    })
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()

  if (error) return bad(error.message, 500)
  if (!data) return bad("Tamu tidak ditemukan", 404)

  return NextResponse.json(data)
}
