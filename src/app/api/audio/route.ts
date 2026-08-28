import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic"

const AUDIO_EXTS = /\.(mp3|wav|ogg|m4a|flac|aac|webm|opus)$/i

function toTitle(filename: string) {
  // hapus ekstensi, decode, biar tampil natural tanpa rename
  const withoutExt = filename.replace(/\.[^/.]+$/, "")
  try {
    return decodeURIComponent(withoutExt)
  } catch {
    return withoutExt
  }
}

export async function GET() {
  const audioDir = path.join(process.cwd(), "public", "audio")

  try {
    if (!fs.existsSync(audioDir)) {
      return NextResponse.json({ data: [] })
    }

    const entries = fs.readdirSync(audioDir, { withFileTypes: true })

    const tracks = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      // abaikan hidden, gitkeep, readme
      .filter((name) => !name.startsWith(".") && name !== ".gitkeep")
      .filter((name) => AUDIO_EXTS.test(name))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({
        name,
        title: toTitle(name),
        // encode per-segment biar spasi & () aman
        src: `/audio/${encodeURIComponent(name)}`,
      }))

    return NextResponse.json({ data: tracks })
  } catch (err) {
    console.error("[GET /api/audio] error", err)
    return NextResponse.json({ data: [] }, { status: 500 })
  }
}
