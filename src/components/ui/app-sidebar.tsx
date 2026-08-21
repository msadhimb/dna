"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ListIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FaComment } from "react-icons/fa"
import { createClient } from "@/utils/supabase/client"
import { NavMain } from "../nav-main"
import { Button } from "../Button"

const data = {
  navMain: [
    {
      title: "Link Generator",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Guest List",
      url: "/dashboard/guests",
      icon: <ListIcon />,
    },
    {
      title: "Comments List",
      url: "/dashboard/comments",
      icon: <FaComment />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <Sidebar collapsible="offcanvas" className="font-manrope" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="font-serif dark:text-white text-muted text-4xl text-center text-balance w-full py-5 border-b border-muted dark:border-white/25">
              D & A
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <Button variant={"destructive"} onClick={handleLogout}>
          Keluar
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
