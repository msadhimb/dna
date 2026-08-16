// Storage URL helper for DNA assets
// Maps local /asset/... paths to Supabase Storage public URLs.
//
// Path mapping:
//   /asset/icon/garuda.png              -> image-icon/garuda.png
//   /asset/pre-wed/image/dark/1.jpg     -> pre-wed/dark/1.jpg
//   /asset/pre-wed/image/light/1.jpg    -> pre-wed/light/1.jpg
//
// Requires NEXT_PUBLIC_SUPABASE_STORAGE_URL in env:
//   https://<project-ref>.supabase.co/storage/v1/object/public

const STORAGE_BASE = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ?? ""

/**
 * Convert a local /asset/... path to its Supabase Storage public URL.
 * Pass-through for non-/asset paths (e.g. URLs, data URIs).
 */
export function getAssetUrl(path: string): string {
  if (!path || !path.startsWith("/asset/")) return path

  // Map /asset/pre-wed/image/<theme>/<file> -> pre-wed/<theme>/<file>
  const match = path.match(/^\/asset\/pre-wed\/image\/(dark|light)\/(.+)$/)
  if (match) {
    return `${STORAGE_BASE}/pre-wed/${match[1]}/${match[2]}`
  }

  // Map /asset/icon/<file> -> image-icon/<file>
  const iconMatch = path.match(/^\/asset\/icon\/(.+)$/)
  if (iconMatch) {
    return `${STORAGE_BASE}/image-icon/${iconMatch[1]}`
  }

  // Fallback: strip /asset/ and serve from image-icon bucket
  return `${STORAGE_BASE}/image-icon/${path.replace(/^\/asset\//, "")}`
}
