import { useImageUrl } from "@/store/useImageUrl"
import { useQuery } from "@tanstack/react-query"
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
      // Muat SEMUA sekaligus: dark + light + icon. Setelah loading selesai,
      // semua gambar siap tampil — ganti theme tidak lagi gagal/blur/kosong.
      const urls = [
        ...new Set([
          ...linksOf(dark),
          ...linksOf(light),
          ...linksOf(imageIcon),
        ]),
      ]

      if (!hasStarted.current) {
        hasStarted.current = true
        preloadImages(urls, onProgressRef.current, (failed) => {
          const finish = () => {
            setImageUrlRef.current({ dark, light, icon: imageIcon })
            onDoneRef.current()
          }
          if (failed.length > 0) {
            // Satu putaran tambahan khusus untuk URL yang sempat gagal
            // sebelum loading dinyatakan selesai.
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
                finish()
              },
              { retries: 5 }
            )
          } else {
            finish()
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
