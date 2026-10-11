"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const TITLE_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  guests: "Guest List",
  comments: "Comments List",
  "buku-tamu": "Buku Tamu",
}

// Navbar admin: trigger + judul serif + tanggal + toggle tema + monogram.
export function SiteHeader() {
  const pathname = usePathname()
  const segment = pathname.split("/")[2] ?? "dashboard"
  const title = TITLE_MAP[segment] ?? TITLE_MAP.dashboard
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-wedding-border bg-background/95 backdrop-blur-md md:rounded-t-xl dark:border-neutral-800 dark:bg-black">
      <div className="flex w-full items-center gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 rounded-full border border-wedding-border" />
        <span className="mx-1 hidden h-8 w-px bg-wedding-border sm:block" />

        <h1 className="min-w-0 flex-1 truncate font-serif text-base font-semibold tracking-[0.16em] text-foreground uppercase">
          {title}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-full border border-wedding-border bg-wedding-surface px-3 py-1.5 text-[11px] font-bold tracking-[0.18em] text-muted uppercase md:block">
            12 . 12 . 2026
          </span>
          <button
            type="button"
            aria-label="Ganti tema"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-wedding-border bg-wedding-surface text-muted transition-colors hover:text-foreground"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
