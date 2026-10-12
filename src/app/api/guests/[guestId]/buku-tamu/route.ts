import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const FIELDS =
  "id, full_name, mantu_status, unduh_mantu_status, guest_from, guest_total, checked_in_at, checked_in_at_mantu, checked_in_at_unduh"

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

  // Satu tamu hanya scan sekali per acara: tidak ada hitungan jumlah,
  // cukup catat waktu check-in. Jumlah rombongan = guest_total.

  // Event yang di-check-in: eksplisit dari panitia, atau otomatis
  // mengikuti tanggal (sebelum 12 Des = mantu, sesudahnya = unduh).
  const nowIso = new Date().toISOString()
  let event = body?.event
  if (event !== "mantu" && event !== "unduh") {
    event =
      new Date(nowIso).getTime() >= new Date("2026-12-12T09:00:00").getTime()
        ? "unduh"
        : "mantu"
  }

  const update: Record<string, unknown> = {
    // Kolom lama tetap diisi untuk kompatibilitas (statistik & list lama).
    checked_in_at: nowIso,
  }
  if (event === "unduh") update.checked_in_at_unduh = nowIso
  else update.checked_in_at_mantu = nowIso

  const { data, error } = await client
    .from("guests")
    .update(update)
    .eq("id", guestId)
    .select(FIELDS)
    .maybeSingle()

  if (error) return bad(error.message, 500)
  if (!data) return bad("Tamu tidak ditemukan", 404)

  return NextResponse.json(data)
}
