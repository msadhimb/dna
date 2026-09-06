import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import MainView from "@/view/Main"
import { createClient } from "@/utils/supabase/server"

export default async function GuestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Basic UUID format check before DB lookup to avoid enumeration
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
  if (!isUUID) notFound()

  const cookieStore = await cookies()
  const client = createClient(cookieStore)
  const { data: guest, error } = await client
    .from("guests")
    .select("id, full_name, guest_from, mantu_status, unduh_mantu_status")
    .eq("id", id)
    .maybeSingle()

  if (error || !guest) notFound()

  return (
    <MainView
      guestId={guest.id}
      guestName={guest.full_name ?? ""}
      guest={guest}
    />
  )
}
