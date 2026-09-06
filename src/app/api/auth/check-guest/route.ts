import { NextRequest, NextResponse } from "next/server"
import {
  verifyGuestToken,
  extractGuestToken,
  isValidUUID,
  applySecurityHeaders,
  logServerError,
} from "@/lib/security"

export async function GET(request: NextRequest) {
  const guestId = request.nextUrl.searchParams.get("guest_id") ?? request.nextUrl.searchParams.get("guestId")

  if (!guestId || !isValidUUID(guestId)) {
    return applySecurityHeaders(
      NextResponse.json({ allowed: false, reason: "invalid_id", error: "ID tamu tidak valid." }, { status: 400 })
    )
  }

  // Extract HMAC token from HttpOnly cookie (proxy sets it)
  const token = extractGuestToken(request)

  if (!token) {
    // No cookie yet — could be first visit before proxy sets it, or blocked cookies
    // Treat as not allowed to write, but distinguish reason for UI
    return applySecurityHeaders(
      NextResponse.json(
        { allowed: false, reason: "no_token", error: "Anda tidak memiliki izin untuk menambahkan komentar." },
        { status: 403 }
      )
    )
  }

  // Verify token matches guestId via HMAC
  let ok = false
  try {
    ok = verifyGuestToken(guestId, token)
  } catch (err) {
    logServerError("GET /api/auth/check-guest verify", err)
    ok = false
  }

  if (!ok) {
    return applySecurityHeaders(
      NextResponse.json(
        {
          allowed: false,
          reason: "mismatch",
          error: "Anda tidak memiliki izin untuk menambahkan komentar. Jika peringatan ini salah hubungi pengirim link ini.",
        },
        { status: 403 }
      )
    )
  }

  return applySecurityHeaders(NextResponse.json({ allowed: true, reason: "ok" }))
}
