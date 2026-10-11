"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import {
  BookOpenText,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  UsersRound,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { NavMain } from "../nav-main"
import { Button } from "../Button"
import OrnamentalDivider from "../Icons/OrnamentalDivider"

const NAV_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: <LayoutDashboard /> },
  { title: "Guest List", url: "/dashboard/guests", icon: <UsersRound /> },
  {
    title: "Comments List",
    url: "/dashboard/comments",
    icon: <MessagesSquare />,
  },
  { title: "Buku Tamu", url: "/dashboard/buku-tamu", icon: <BookOpenText /> },
]

// Sidebar admin bernuansa undangan: monogram D&A + menu emas + logout elegan.
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-wedding-border font-manrope"
      {...props}
    >
      <SidebarHeader className="px-4 pt-5 pb-3">
        <div className="flex flex-col items-center text-center">
          <p className="font-signature text-2xl leading-none text-muted">
            Devi & Adhim
          </p>
          <p className="mt-1 text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase">
            Wedding Console
          </p>
          <OrnamentalDivider size="small" className="mt-3 w-full" />
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-1">
        <NavMain items={NAV_ITEMS} />
        <div className="mx-4 rounded-2xl border border-wedding-border bg-wedding-surface p-3.5 shadow-wedding-card">
          <p className="font-serif text-sm font-semibold text-foreground">
            Sabtu, 12 . 12 . 2026
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Kelola tamu, ucapan & check-in dalam satu tempat yang rapi.
          </p>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-2xl border border-wedding-border p-3">
          <p className="truncate text-xs font-semibold text-foreground">
            Panitia Undangan
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            Masuk sebagai admin
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="mt-2.5 w-full"
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
