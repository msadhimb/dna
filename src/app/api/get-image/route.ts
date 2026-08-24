// src/app/api/get-image/route.ts
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const folder = request.nextUrl.searchParams.get("folder")
    const folders = folder ? [folder] : ["pre-wed/dark", "pre-wed/light"]

    const folderPath = folders.map((f) => {
      const parts = f.split("/")
      return {
        folder: parts[0],
        subfolder: parts[1] ?? null, // ✅ null jika tidak ada subfolder
      }
    })

    const results: Record<string, { link: string }[]> = {}

    for (const f of folderPath) {
      const { data, error } = await supabase.storage
        .from(f.folder)
        .list(f.subfolder ?? undefined, {
          // ✅ undefined jika null (list root)
          limit: 1000,
          sortBy: { column: "name", order: "asc" },
        })

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 })
      }

      const key = f.subfolder ?? f.folder // ✅ key pakai folder jika tidak ada subfolder

      results[key] = data
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        .map((file) => {
          // ✅ Path benar: "subfolder/file.jpg" atau "file.jpg"
          const path = f.subfolder ? `${f.subfolder}/${file.name}` : file.name
          const { data } = supabase.storage.from(f.folder).getPublicUrl(path)
          return { name: file.name, link: data.publicUrl }
        })
    }

    return NextResponse.json({ data: results })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
