export type WaGuest = {
  full_name?: string
  mantu_status?: boolean
  unduh_mantu_status?: boolean
}

// Template pesan WA personal — dipakai Guest List & modal Share WA.
export const buildWaMessage = (guest: WaGuest, link: string) => {
  const guestName = guest?.full_name || "Bapak/Ibu/Saudara/i"
  const isMantu = guest?.mantu_status === true
  const isUnduh = guest?.unduh_mantu_status === true
  let dateStr = "Sabtu, 12 Desember 2026"
  if (isUnduh && isMantu) dateStr = "Sabtu, 12 & 26 Desember 2026"
  else if (isUnduh) dateStr = "Sabtu, 26 Desember 2026"
  else if (isMantu) dateStr = "Sabtu, 12 Desember 2026"

  return `Yth. ${guestName},

Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan kami:

Devi & Adhim
${dateStr}

Kehadiran dan doa restu Anda sangat berarti bagi kami.

Berikut link undangan personal Anda:
${link}

Mohon maaf apabila undangan ini disampaikan melalui pesan singkat. Atas perhatian dan doa restunya kami ucapkan terima kasih.

Salam hangat,
Devi & Adhim`
}
