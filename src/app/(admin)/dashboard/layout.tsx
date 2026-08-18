import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-manrope">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
