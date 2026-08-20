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
    queryKey: ["images", "pre-wed"],
    retry: 1,
    queryFn: async () => {
      const res = await axios.get("/api/get-image")
      let imageIcon: { link: string }[] = []
      try {
        const resIcon = await axios.get("/api/get-image?folder=image-icon")
        imageIcon = resIcon.data?.data?.["image-icon"] ?? []
      } catch {
        // Icon images are optional; they must not block the invitation animation.
      }

      const dark = res.data?.data?.dark ?? []
      const light = res.data?.data?.light ?? []

      // Preload only the active theme. Preloading both themes doubles image
      // downloads and decoded bitmap memory on mobile, while Next Image can
      // fetch the alternate theme later if the user switches themes.
      const activeThemeImages = resolvedTheme === "dark" ? dark : light
      const urls = [
        ...activeThemeImages.map((img: { link: string }) => img.link),
        ...imageIcon.map((img: { link: string }) => img.link),
      ]

      if (!hasStarted.current) {
        hasStarted.current = true
        preloadImages(urls, onProgressRef.current, () => {
          setImageUrlRef.current({ dark, light, icon: imageIcon })
          onDoneRef.current()
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
