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

  return useQuery<{ data: ImageData }>({
    queryKey: ["images", "pre-wed"],
    queryFn: async () => {
      const res = await axios.get("/api/get-image")
      const resIcon = await axios.get("/api/get-image?folder=image-icon")

      const { "image-icon": imageIcon } = resIcon.data.data
      const { dark, light } = res.data.data

      const urls = [
        ...dark.map((img: { link: string }) => img.link),
        ...light.map((img: { link: string }) => img.link),
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
}

export default usePreloadImages
