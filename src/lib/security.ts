import crypto from "crypto"
import { NextRequest, NextResponse } from "next/server"

// ── Fail-closed secret helpers ──────────────────────────────────────────────
export function requireEnv(name: string): string {
  const v = process.env[name]
  if (!v || v.trim().length === 0) {
    throw new Error(`Missing required secret: ${name}`)
  }
  return v
}

export function getGuestHmacSecret(): string {
  return requireEnv("GUEST_HMAC_SECRET")
}

export function getAdminAllowlist(): string[] {
  const raw = process.env.ADMIN_ALLOWLIST ?? ""
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

// ── HMAC guest ownership ────────────────────────────────────────────────────
export function signGuestId(guestId: string): string {
  const secret = getGuestHmacSecret()
  return crypto.createHmac("sha256", secret).update(guestId).digest("hex")
}

export function verifyGuestToken(guestId: string, token: string): boolean {
  if (!guestId || !token) return false
  let expected: string
  try {
    expected = signGuestId(guestId)
  } catch {
    return false
  }
  if (expected.length !== token.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(token, "utf8"))
  } catch {
    return false
  }
}

export function extractGuestToken(request: NextRequest): string | null {
  // Ownership comes only from the server-issued HttpOnly cookie.
  // Guests never log in and clients cannot supply bearer tokens.
  const cookie = request.cookies.get("guest_token")?.value?.trim()
  if (cookie) return cookie
  return null
}

export function createGuestTokenCookie(guestId: string) {
  const token = signGuestId(guestId)
  return { name: "guest_token", value: token }
}

// ── In-memory rate limiter ──────────────────────────────────────────────────
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]!.trim()
  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp.trim()
  return "unknown"
}

export function checkRateLimit(
  request: NextRequest,
  opts: { keyPrefix: string; limit: number; windowMs: number }
): { allowed: true; remaining: number; resetAt: number } | { allowed: false; response: NextResponse } {
  const ip = getClientIp(request)
  const key = `${opts.keyPrefix}:${ip}`
  const now = Date.now()
  let b = buckets.get(key)
  if (!b || now > b.resetAt) {
    b = { count: 1, resetAt: now + opts.windowMs }
    buckets.set(key, b)
    return { allowed: true, remaining: opts.limit - 1, resetAt: b.resetAt }
  }
  if (b.count >= opts.limit) {
    const retryAfter = Math.ceil((b.resetAt - now) / 1000)
    const res = NextResponse.json({ error: "Terlalu banyak permintaan, coba lagi nanti." }, { status: 429 })
    res.headers.set("Retry-After", String(retryAfter))
    res.headers.set("X-RateLimit-Remaining", "0")
    return { allowed: false, response: res }
  }
  b.count += 1
  return { allowed: true, remaining: opts.limit - b.count, resetAt: b.resetAt }
}

// Optional cleanup to avoid unbounded growth (call periodically)
if (typeof setInterval !== "undefined") {
  // run only on server
  try {
    setInterval(() => {
      const now = Date.now()
      for (const [k, v] of buckets) {
        if (now > v.resetAt) buckets.delete(k)
      }
      if (buckets.size > 10000) {
        // fail-safe: clear half
        const keys = Array.from(buckets.keys()).slice(0, 5000)
        keys.forEach((k) => buckets.delete(k))
      }
    }, 60_000).unref?.()
  } catch {}
}

// ── Validation helpers ──────────────────────────────────────────────────────
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function isValidUUID(v: string): boolean {
  return UUID_RE.test(v)
}

export function isValidGuestName(name: string): boolean {
  const t = name.trim()
  return t.length >= 2 && t.length <= 100
}

export function isValidComment(comment: string): boolean {
  const t = comment.trim()
  return t.length >= 5 && t.length <= 1000
}

export function sanitizeSearchParam(s: string, maxLen = 100): string {
  return s.trim().slice(0, maxLen)
}

export const ALLOWED_FOLDERS = new Set(["pre-wed/dark", "pre-wed/light", "image-icon"])

export function isAllowedFolder(folder: string): boolean {
  // exact allowlist, no traversal
  if (folder.includes("..") || folder.includes("\\") || folder.includes("//")) return false
  if (folder.startsWith("/") || folder.endsWith("/")) return false
  return ALLOWED_FOLDERS.has(folder)
}

// ── Safe error ──────────────────────────────────────────────────────────────
export function safeErrorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function internalErrorResponse() {
  // never leak internal details
  return NextResponse.json({ error: "Terjadi kesalahan internal." }, { status: 500 })
}

export function logServerError(context: string, err: unknown) {
  // server-side only logging; never expose to client
  console.error(`[${context}]`, err instanceof Error ? err.message : err)
}

// ── Admin allowlist check ───────────────────────────────────────────────────
export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false
  const allowlist = getAdminAllowlist()
  // fail closed if allowlist not configured
  if (allowlist.length === 0) return false
  return allowlist.includes(email.toLowerCase())
}

export function getClaimEmail(claims: unknown): string | null {
  if (!claims || typeof claims !== "object") return null
  const c = claims as Record<string, unknown>
  // supabase getClaims returns { claims: { sub, email, ... } } nested
  const direct = c.email
  if (typeof direct === "string") return direct
  // nested under claims?
  const nested = (c as { claims?: unknown }).claims
  if (nested && typeof nested === "object") {
    const e = (nested as Record<string, unknown>).email
    if (typeof e === "string") return e
  }
  // try user_metadata
  const um = c.user_metadata as Record<string, unknown> | undefined
  if (um && typeof um.email === "string") return um.email
  return null
}

// ── Security headers ────────────────────────────────────────────────────────
export const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "off",
}

export function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(k, v)
  }
  return res
}
