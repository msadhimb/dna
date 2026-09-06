import { hasEnvVars } from "@/lib/utils"
import { createGuestTokenCookie } from "@/lib/security"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!hasEnvVars) {
    return supabaseResponse
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data } = await supabase.auth.getClaims()
  const user = data?.claims as unknown as Record<string, unknown> | null

  // Admin allowlist check (fail closed: if not configured, deny dashboard)
  const allowlist = (process.env.ADMIN_ALLOWLIST ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
  const email = (user as unknown as { email?: string })?.email ?? (user as unknown as { claims?: { email?: string } })?.claims?.email ?? null
  const isAllowedAdmin = !!email && allowlist.includes(String(email).toLowerCase())

  const isDashboardRoute =
    request.nextUrl.pathname === "/dashboard" ||
    request.nextUrl.pathname.startsWith("/dashboard/")

  if (isDashboardRoute) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
    // Authenticated but not in allowlist -> deny (fail closed)
    if (allowlist.length > 0 && !isAllowedAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("error", "unauthorized")
      return NextResponse.redirect(url)
    }
    // If allowlist not configured, fail closed: treat as misconfiguration
    if (allowlist.length === 0) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("error", "config")
      return NextResponse.redirect(url)
    }
  }

  if (user && isAllowedAdmin && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Issue guest ownership cookie before the invitation Server Component renders.
  // Guests do not log in; the invitation URL establishes the guest context.
  const guestPath = request.nextUrl.pathname.match(/^\/([0-9a-f-]{36})$/i)
  if (guestPath && !request.cookies.get("guest_token")) {
    try {
      const { name, value } = createGuestTokenCookie(guestPath[1]!)
      supabaseResponse.cookies.set(name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    } catch {
      // Missing secret intentionally leaves writes fail-closed.
    }
  }

  // Apply security headers to all responses via proxy as well
  for (const [k, v] of Object.entries({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "X-DNS-Prefetch-Control": "off",
  })) {
    supabaseResponse.headers.set(k, v)
  }

  return supabaseResponse
}
