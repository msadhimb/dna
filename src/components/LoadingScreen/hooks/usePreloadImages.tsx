import { useImageUrl } from "@/store/useImageUrl"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useRef } from "react"
import { preloadImages } from "../helper/preload"

type PrewedImageItem = { link: string; name?: string }
type PrewedPayload = {
  dark?: PrewedImageItem[]
  light?: PrewedImageItem[]
  [key: string]: PrewedImageItem[] | undefined
}

const usePreloadImages = (
  onProgress: (p: number) => void,
  onDone: () => void
) => {
  const hasStarted = useRef(false)
  const hasFinished = useRef(false)
  const onDoneRef = useRef(onDone)
  const onProgressRef = useRef(onProgress)
  const { setImageUrl } = useImageUrl()
  const setImageUrlRef = useRef(setImageUrl)

  useEffect(() => {
    onDoneRef.current = onDone
    onProgressRef.current = onProgress
  })

  useEffect(() => {
    setImageUrlRef.current = setImageUrl
  }, [setImageUrl])

  const query = useQuery<{ data: PrewedPayload }>({
    queryKey: ["images", "pre-wed"],
    retry: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get("/api/get-image")
      return res.data
    },
  })

  useEffect(() => {
    const data = query.data as
      | { data?: PrewedPayload }
      | PrewedPayload
      | undefined
    const payload = (data as { data?: PrewedPayload })?.data ?? data
    if (!payload || !query.isSuccess || hasStarted.current) return
    hasStarted.current = true

    let cancelled = false

    const finishOnce = () => {
      if (cancelled || hasFinished.current) return
      hasFinished.current = true
      onDoneRef.current()
    }

    const run = async () => {
      const dark = (payload as PrewedPayload)?.dark ?? []
      const light = (payload as PrewedPayload)?.light ?? []
      let imageIcon: { link: string }[] = []
      try {
        const resIcon = await axios.get("/api/get-image?folder=image-icon")
        imageIcon = resIcon.data?.data?.["image-icon"] ?? []
      } catch {
        imageIcon = []
      }
      if (cancelled) return
      setImageUrlRef.current({ dark, light, icon: imageIcon })
      const linksOf = (arr: { link: string }[]) =>
        arr.map((img) => img.link).filter(Boolean)
      const isDarkMode = () => {
        if (typeof document !== "undefined") {
          if (document.documentElement.classList.contains("dark")) return true
        }
        if (typeof window !== "undefined" && window.matchMedia) {
          return window.matchMedia("(prefers-color-scheme: dark)").matches
        }
        return false
      }
      const active = isDarkMode() ? dark : light
      const idle = isDarkMode() ? light : dark
      const activeLinks = linksOf(active)
      const idleLinks = linksOf(idle)
      const iconLinks = linksOf(imageIcon)
      const pick = (arr: string[], idx: number[]) =>
        idx.map((i) => arr[i]).filter(Boolean)
      const critical = [
        ...new Set([
          ...pick(activeLinks, [0, 1, 2, 3, 4, 5]),
          ...pick(iconLinks, [0, 1, 2, 3]),
        ]),
      ].slice(0, 8)
      const rest = [
        ...new Set([...activeLinks, ...iconLinks, ...idleLinks]),
      ].filter((u) => !critical.includes(u))
      if (critical.length === 0 && rest.length === 0) {
        finishOnce()
        return
      }
      const blocking = critical.length > 0 ? critical : rest.slice(0, 8)
      const background = critical.length > 0 ? rest : rest.slice(8)
      preloadImages(
        blocking,
        (p) => {
          if (!cancelled) onProgressRef.current(p)
        },
        () => {
          finishOnce()
          if (background.length > 0 && !cancelled) {
            const idleRun = () => {
              preloadImages(background, () => {}, () => {}, {
                retries: 0,
                concurrency: 1,
              })
            }
            const ric = (
              window as unknown as {
                requestIdleCallback?: (cb: () => void) => number
              }
            ).requestIdleCallback
            if (typeof ric === "function") ric.call(window, idleRun)
            else setTimeout(idleRun, 3000)
          }
        }
      )
    }

    run()

    return () => {
      cancelled = true
    }
  }, [query.data, query.isSuccess])

  useEffect(() => {
    if (query.isError && !hasFinished.current) {
      hasFinished.current = true
      setImageUrlRef.current({ dark: [], light: [], icon: [] })
      onDoneRef.current()
    }
  }, [query.isError])

  return query
}

export default usePreloadImages
