import { Gift, LucideIcon, MapPin, MessageCircle } from "lucide-react"

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
    id: "digital-gift",
    no: "03",
    label: "Wedding Gift",
    hint: "Tanda kasih untuk kami",
    Icon: Gift,
  },
]
