"use client"

import Link from "next/link"
import {
  ArrowUpRight,
  BookOpenText,
  MessagesSquare,
  UsersRound,
} from "lucide-react"

const SHORTCUTS = [
  {
    href: "/dashboard/guests",
    icon: <UsersRound className="size-4" />,
    title: "Kelola Tamu",
    desc: "Import, filter & bagikan WA",
  },
  {
    href: "/dashboard/comments",
    icon: <MessagesSquare className="size-4" />,
    title: "Lihat Ucapan",
    desc: "Doa & konfirmasi hadir",
  },
  {
    href: "/dashboard/buku-tamu",
    icon: <BookOpenText className="size-4" />,
    title: "Buka Buku Tamu",
    desc: "Scan QR saat acara",
  },
]

// Pintasan elegan ke tiga halaman admin lainnya.
export const DashboardShortcuts = () => {
  return (
    <div className="flex flex-col gap-2.5">
      {SHORTCUTS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className="group flex items-center gap-3 rounded-2xl border border-wedding-border bg-background p-3.5 transition-all hover:-translate-y-px hover:border-book-ornament/40 hover:shadow-wedding-card"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-book-ornament/30 bg-book-ornament/10 text-book-ornament dark:text-book-cover-title">
            {s.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-foreground">
              {s.title}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {s.desc}
            </span>
          </span>
          <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      ))}
    </div>
  )
}
