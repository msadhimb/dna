import { Gift, LucideIcon, MapPin, MessageCircle, QrCode } from "lucide-react"

export interface NavLink {
  id: string
  no: string
  label: string
  hint: string
  Icon: LucideIcon
}

export const LINKS: readonly NavLink[] = [
  {
    id: "time-and-place",
    no: "01",
    label: "Waktu & Tempat",
    hint: "Tanggal, jam & lokasi",
    Icon: MapPin,
  },
  {
    id: "comment",
    no: "02",
    label: "Ucapan & Doa",
    hint: "Titip doa untuk kami",
    Icon: MessageCircle,
  },
  {
    id: "check-in-ticket",
    no: "03",
    label: "Tiket Masuk",
    hint: "QR check-in acara",
    Icon: QrCode,
  },
  {
    id: "digital-gift",
    no: "04",
    label: "Wedding Gift",
    hint: "Tanda kasih untuk kami",
    Icon: Gift,
  },
]
