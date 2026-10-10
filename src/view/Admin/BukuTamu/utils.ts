export type SimpleCamera = { id: string; label: string }

// QR berisi id tamu atau URL undangan personal (.../{id}) -> ambil id-nya
export const parseGuestId = (text: string) => {
  const trimmed = text.trim().replace(/\/+$/, "")
  const parts = trimmed.split("/")
  return parts[parts.length - 1].trim()
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
