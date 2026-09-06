import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import {
  getAdminAllowlist,
  getClaimEmail,
  isEmailAllowed,
  applySecurityHeaders,
  logServerError,
} from "@/lib/security"

export async function GET() {
  try {
    const allowlist = getAdminAllowlist()
    if (allowlist.length === 0) {
      logServerError("GET /api/auth/check-allowlist", "ADMIN_ALLOWLIST not configured")
      return applySecurityHeaders(
        NextResponse.json(
          {
            allowed: false,
            reason: "config",
            error: "Konfigurasi admin belum diatur. Hubungi administrator.",
          },
          { status: 403 }
        )
      )
    }

    const supabase = createClient(await cookies())
    const { data, error } = await supabase.auth.getClaims()
    if (error || !data?.claims) {
      return applySecurityHeaders(
        NextResponse.json({ allowed: false, reason: "unauthenticated", error: "Belum login." }, { status: 401 })
      )
    }

    const email = getClaimEmail(data.claims)
    if (!email || !isEmailAllowed(email)) {
      return applySecurityHeaders(
        NextResponse.json(
          { allowed: false, reason: "unauthorized", error: "Email tidak diizinkan sebagai admin." },
          { status: 403 }
        )
      )
    }

    return applySecurityHeaders(NextResponse.json({ allowed: true, email }))
  } catch (err) {
    logServerError("GET /api/auth/check-allowlist", err)
    return applySecurityHeaders(
      NextResponse.json({ allowed: false, reason: "error", error: "Terjadi kesalahan internal." }, { status: 500 })
    )
  }
}
