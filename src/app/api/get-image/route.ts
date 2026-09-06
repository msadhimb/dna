
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import {
  ALLOWED_FOLDERS,
  checkRateLimit,
  isAllowedFolder,
  internalErrorResponse,
  logServerError,
  safeErrorResponse,
  applySecurityHeaders,
} from "@/lib/security"

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, {
    keyPrefix: "get-image",
    limit: 30,
    windowMs: 60_000,
  })
  if (!rate.allowed) return applySecurityHeaders(rate.response)

  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const folderParam = request.nextUrl.searchParams.get("folder")?.trim() ?? ""
    let folders: string[]
    if (folderParam) {
      // allowlist + path traversal defense
      if (!isAllowedFolder(folderParam)) {
        return applySecurityHeaders(safeErrorResponse("Folder tidak diizinkan.", 400))
      }
      folders = [folderParam]
    } else {
      folders = ["pre-wed/dark", "pre-wed/light"]
    }

    // double-check all folders are allowlisted (defense in depth)
    for (const f of folders) {
      if (!ALLOWED_FOLDERS.has(f) || !isAllowedFolder(f)) {
        return applySecurityHeaders(safeErrorResponse("Folder tidak diizinkan.", 400))
      }
    }

    const folderPath = folders.map((f) => {
      const parts = f.split("/")
      return {
        folder: parts[0],
        subfolder: parts[1] ?? null,
      }
    })

    const results: Record<string, { link: string }[]> = {}

    for (const f of folderPath) {
      const { data, error } = await supabase.storage
        .from(f.folder)
        .list(f.subfolder ?? undefined, {
          limit: 100,
          sortBy: { column: "name", order: "asc" },
        })

      if (error) {
        logServerError("GET /api/get-image", error)
        return applySecurityHeaders(internalErrorResponse())
      }

      const key = f.subfolder ?? f.folder

      results[key] = data
        .filter((file) => file.name !== ".emptyFolderPlaceholder")
        // extra filename sanity: reject traversal chars
        .filter((file) => !file.name.includes("..") && !file.name.includes("/") && !file.name.includes("\\"))
        .map((file) => {
          const path = f.subfolder ? `${f.subfolder}/${file.name}` : file.name
          const { data } = supabase.storage.from(f.folder).getPublicUrl(path)
          return { name: file.name, link: data.publicUrl }
        })
    }

    const res = NextResponse.json({ data: results })
    res.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    return applySecurityHeaders(res)
  } catch (error) {
    logServerError("GET /api/get-image", error)
    return applySecurityHeaders(internalErrorResponse())
  }
}
