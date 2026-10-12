import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

// Status check-in publik untuk polling halaman tamu.
// Sengaja hanya mengembalikan kolom check-in (tanpa data pribadi lain)
// agar QR di HP tamu bisa hilang otomatis setelah panitia scan.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  if (!id) return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })

  const client = createClient(await cookies())
  const { data, error } = await client
    .from("guests")
    .select("id, checked_in_at, checked_in_at_mantu, checked_in_at_unduh")
    .eq("id", id)
    .maybeSingle()

  if (error || !data)
    return NextResponse.json({ error: "Tamu tidak ditemukan" }, { status: 404 })

  return NextResponse.json(data)
}
