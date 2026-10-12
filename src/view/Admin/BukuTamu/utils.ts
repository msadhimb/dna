export type SimpleCamera = { id: string; label: string }

type ParsedQr = { guestId: string; event: "mantu" | "unduh" | null }

// QR berisi id tamu atau URL undangan personal (.../{id}?event=...) -> ambil id & event-nya
export const parseGuestId = (text: string): ParsedQr => {
  const trimmed = text.trim().replace(/\/+$/, "")

  // Pisah path dari query string
  const [pathPart, queryPart] = trimmed.split("?")
  const parts = pathPart.split("/")
  const guestId = parts[parts.length - 1].trim()

  // Baca ?event= kalau ada
  const params = new URLSearchParams(queryPart ?? "")
  const rawEvent = params.get("event")
  const event: ParsedQr["event"] =
    rawEvent === "mantu" || rawEvent === "unduh" ? rawEvent : null

  return { guestId, event }
}

// Kamera belakang biasanya berlabel back/rear; kalau tidak ketahuan, pakai terakhir
export const pickRearCameraIndex = (list: SimpleCamera[]) => {
  const idx = list.findIndex((c) =>
    /back|rear|belakang|environment/i.test(c.label)
  )
  return idx >= 0 ? idx : list.length - 1
}

export const formatCheckInTime = (iso: string | null | undefined) => {
  if (!iso) return "-"
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })
}
