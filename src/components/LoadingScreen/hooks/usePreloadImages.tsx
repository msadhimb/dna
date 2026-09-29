import { useImageUrl } from "@/store/useImageUrl"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useRef } from "react"
import { preloadImages } from "../helper/preload"

/**
 * Theme yang sedang aktif, dibaca sinkron (next-themes sudah menulis class
 * ke <html> sebelum hydration via inline script anti-FOUC).
 */
const getActiveIsDark = () => {
  if (typeof document === "undefined") return false
  if (document.documentElement.classList.contains("dark")) return true
  try {
    const stored = localStorage.getItem("theme")
    if (stored === "dark") return true
    if (stored === "light" || stored === "system") {
      if (stored === "light") return false
    }
  } catch {
    // abaikan — jatuh ke matchMedia
  }
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-color-scheme: dark)").matches
  )
}

const usePreloadImages = (
  onProgress: (p: number) => void,
  onDone: () => void
) => {
  const hasStarted = useRef(false)
  const onDoneRef = useRef(onDone)
  const onProgressRef = useRef(onProgress)
  const { setImageUrl } = useImageUrl()
  const setImageUrlRef = useRef(setImageUrl)

  useEffect(() => {
    onDoneRef.current = onDone
    onProgressRef.current = onProgress
  })

  const query = useQuery<{ data: ImageData }>({
    queryKey: ["images", "pre-wed"],
    retry: 1,
    queryFn: async () => {
      const res = await axios.get("/api/get-image")
      let imageIcon: { link: string }[] = []
      try {
        const resIcon = await axios.get("/api/get-image?folder=image-icon")
        imageIcon = resIcon.data?.data?.["image-icon"] ?? []
      } catch {
        
      }

      const dark = res.data?.data?.dark ?? []
      const light = res.data?.data?.light ?? []

      const linksOf = (arr: { link: string }[]) =>
        arr.map((img) => img.link).filter(Boolean)
      // Hemat memori (krusial di iOS Safari): preload KRITIS dulu = theme
      // aktif + icon. Theme satunya menyusul di background setelah halaman
      // dibuka — decode ~18MB (dark) / ~96MB×N bitmap tidak lagi menumpuk
      // bersamaan saat loading.
      const isDark = getActiveIsDark()
      const active = isDark ? dark : light
      const idle = isDark ? light : dark
      const criticalUrls = [
        ...new Set([...linksOf(active), ...linksOf(imageIcon)]),
      ]
      const idleUrls = [...new Set(linksOf(idle))]

      if (!hasStarted.current) {
        hasStarted.current = true
        preloadImages(criticalUrls, onProgressRef.current, (failed) => {
          const finishCritical = () => {
            // Theme non-aktif dikosongkan dulu, diisi saat background selesai.
            setImageUrlRef.current(
              isDark
                ? { dark: active, light: [], icon: imageIcon }
                : { dark: [], light: active, icon: imageIcon }
            )
            onDoneRef.current()
            preloadIdleTheme()
          }
          // Background: theme satunya, idle + retry ringan + tanpa progress.
          // Gagal di sini tidak fatal (theme toggle akan load on-demand).
          const preloadIdleTheme = () => {
            if (idleUrls.length === 0) return
            const run = () =>
              preloadImages(
                idleUrls,
                () => {},
                (stillFailed) => {
                  if (stillFailed.length > 0) {
                    console.warn(
                      "[preload] theme idle gagal dimuat:",
                      stillFailed
                    )
                  }
                  setImageUrlRef.current(
                    isDark ? { light: idle } : { dark: idle }
                  )
                },
                { retries: 2, timeoutMs: 20000, concurrency: 2 }
              )
            const w = window as unknown as {
              requestIdleCallback?: (
                cb: () => void,
                opts?: { timeout: number }
              ) => void
              setTimeout: (...args: [handler: () => void, ms: number]) => number
            }
            if (typeof w.requestIdleCallback === "function") {
              w.requestIdleCallback(run, { timeout: 8000 })
            } else {
              w.setTimeout(run, 1500)
            }
          }
          if (failed.length > 0) {
            // Satu putaran tambahan khusus untuk URL kritis yang sempat
            // gagal sebelum loading dinyatakan selesai.
            preloadImages(
              failed,
              () => {},
              (stillFailed) => {
                if (stillFailed.length > 0) {
                  console.warn(
                    "[preload] gambar tetap gagal setelah retry:",
                    stillFailed
                  )
                }
                finishCritical()
              },
              { retries: 5 }
            )
          } else {
            finishCritical()
          }
        })
      }

      return res.data
    },
  })

  useEffect(() => {
    if (query.isError && !hasStarted.current) {
      hasStarted.current = true
      setImageUrlRef.current({ dark: [], light: [], icon: [] })
      onDoneRef.current()
    }
  }, [query.isError])

  return query
}

export default usePreloadImages
