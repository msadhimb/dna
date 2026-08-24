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
  const client = createClient(await cookies())
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
