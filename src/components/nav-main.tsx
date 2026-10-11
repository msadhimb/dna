"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  badge?: string
}

// Navigasi utama sidebar dengan indikator emas + chip ikon elegan.
export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="px-2">
      <SidebarGroupLabel className="px-3 text-[10px] font-bold tracking-[0.28em] text-muted uppercase">
        Menu Utama
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {items.map((item) => {
            const active =
              item.url === "/dashboard"
                ? pathname === item.url
                : pathname === item.url || pathname.startsWith(`${item.url}/`)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={active}
                  asChild
                  className={cn(
                    "relative h-11 rounded-xl px-3 transition-all",
                    active
                      ? "bg-muted/15 font-semibold text-foreground shadow-sm ring-1 ring-muted/30 dark:bg-primary/20 dark:ring-primary/30"
                      : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                  )}
                >
                  <Link href={item.url}>
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-2 bottom-2 left-0 w-1 rounded-full transition-all",
                        active
                          ? "bg-book-ornament opacity-100"
                          : "bg-transparent opacity-0"
                      )}
                    />
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                        active
                          ? "border-book-ornament/40 bg-book-ornament/10 text-book-ornament dark:text-book-cover-title"
                          : "border-border bg-background text-muted"
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-book-ornament/15 px-2 py-0.5 text-[10px] font-bold text-book-ornament">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
