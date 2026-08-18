"use client"

import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = pathname.split("/")[2] ?? "Link Generator"
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-8"
        />
        <h1 className="text-base font-medium">
          {pageTitle?.charAt(0).toUpperCase() + pageTitle?.slice(1)}
        </h1>
      </div>
    </header>
  )
}
