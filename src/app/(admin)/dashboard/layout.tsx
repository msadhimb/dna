import { SiteHeader } from "@/components/site-header"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getClaimEmail, isEmailAllowed } from "@/lib/security"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(await cookies())
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) redirect("/login")

  const email = getClaimEmail(data.claims)
  // Defense in depth: enforce allowlist here as well (fail closed)
  const { getAdminAllowlist } = await import("@/lib/security")
  const allowlist = getAdminAllowlist()
  if (allowlist.length === 0) {
    redirect("/login?error=config")
  }
  if (!email || !isEmailAllowed(email)) {
    redirect("/login?error=unauthorized")
  }

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
