import { SiteHeader } from "@/components/site-header"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(await cookies())
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  return (
    <div className="h-dvh overflow-hidden font-manrope [--sidebar:var(--color-stone-200)] dark:[--sidebar:oklch(0.205_0_0)]">
      <SidebarProvider
        className="h-dvh min-h-0 overflow-hidden"
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="min-h-0 min-w-0 bg-[oklch(0.985_0_0)] md:max-h-[calc(100dvh-1rem)] md:overflow-hidden dark:bg-neutral-950">
          <SiteHeader />
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <div className="flex w-full flex-col gap-4 p-4 sm:p-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
