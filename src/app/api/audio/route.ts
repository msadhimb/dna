import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { checkRateLimit, applySecurityHeaders, logServerError } from "@/lib/security"

export const dynamic = "force-dynamic"

const AUDIO_EXTS = /\.(mp3|wav|ogg|m4a|flac|aac|webm|opus)$/i

function toTitle(filename: string) {
  
  const withoutExt = filename.replace(/\.[^/.]+$/, "")
  try {
    return decodeURIComponent(withoutExt)
  } catch {
    return withoutExt
  }
}

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, { keyPrefix: "audio", limit: 30, windowMs: 60_000 })
  if (!rate.allowed) return applySecurityHeaders(rate.response)
  const audioDir = path.join(process.cwd(), "public", "audio")

  try {
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json({ data: [] })
    }

    const entries = fs.readdirSync(audioDir, { withFileTypes: true })

    const tracks = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      
      .filter((name) => !name.startsWith(".") && name !== ".gitkeep")
      .filter((name) => AUDIO_EXTS.test(name))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        title: toTitle(name),
        
        src: `/audio/${encodeURIComponent(name)}`,
      }))

    const res = NextResponse.json({ data: tracks })
    res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    return applySecurityHeaders(res)
  } catch (err) {
    logServerError("GET /api/audio", err)
    return applySecurityHeaders(NextResponse.json({ data: [] }, { status: 500 }))
  }
}
