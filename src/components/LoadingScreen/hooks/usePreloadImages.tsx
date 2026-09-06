import { useImageUrl } from "@/store/useImageUrl"
import { useQuery } from "@tanstack/react-query"
import { useTheme } from "next-themes"
import axios from "axios"
import { useEffect, useRef } from "react"
import { preloadImages } from "../helper/preload"

const usePreloadImages = (
  onProgress: (p: number) => void,
  onDone: () => void
) => {
  const hasStarted = useRef(false)
  const onDoneRef = useRef(onDone)
  const onProgressRef = useRef(onProgress)
  const { setImageUrl } = useImageUrl()
  const setImageUrlRef = useRef(setImageUrl)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    onDoneRef.current = onDone
    onProgressRef.current = onProgress
  })

  const query = useQuery<{ data: ImageData }>({
    queryKey: ["images", "pre-wed", resolvedTheme ?? "unknown"],
    retry: 1,
    staleTime: 1000 * 60 * 5,
    // Jangan refetch saat window focus (hindari jank ulang di mobile)
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get("/api/get-image")
      let imageIcon: { link: string }[] = []
      try {
        const resIcon = await axios.get("/api/get-image?folder=image-icon")
        imageIcon = resIcon.data?.data?.["image-icon"] ?? []
      } catch {}

      const dark = res.data?.data?.dark ?? []
      const light = res.data?.data?.light ?? []

      // Tunda preload berat sampai browser selesai paint loading-screen pertama
      // agar gsap message + progress tidak jank di mobile.
      const activeThemeImages = resolvedTheme === "dark" ? dark : light
      const urls = [
        ...activeThemeImages.map((img: { link: string }) => img.link),
        ...imageIcon.map((img: { link: string }) => img.link),
      ]

      if (!hasStarted.current) {
        hasStarted.current = true
        const startPreload = () =>
          preloadImages(urls, onProgressRef.current, () => {
            setImageUrlRef.current({ dark, light, icon: imageIcon })
            onDoneRef.current()
          })
        // double rAF + idle: beri waktu loading-screen mount & first paint
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const ric = (window as any).requestIdleCallback as
              | ((cb: () => void, opts?: { timeout: number }) => number)
              | undefined
            if (ric) ric(startPreload, { timeout: 500 })
            else setTimeout(startPreload, 120)
          })
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
