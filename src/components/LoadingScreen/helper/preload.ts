interface PreloadOptions {
  retries?: number
  timeoutMs?: number
  retryDelayMs?: number
  concurrency?: number
}

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false
  const ua = navigator.userAgent || ""
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return true
  if (typeof window !== "undefined" && window.innerWidth < 768) return true
  return false
}

export const preloadImages = (
  urls: string[],
  onProgress: (progress: number) => void,
  onDone: (failedUrls: string[]) => void,
  options: PreloadOptions = {}
) => {
  const uniqueUrls = [...new Set(urls.filter(Boolean))]
  if (uniqueUrls.length === 0) {
    onProgress(100)
    setTimeout(() => onDone([]), 500)
    return
  }

  const mobile = isMobileDevice()
  const {
    retries = mobile ? 1 : 2,
    timeoutMs = mobile ? 15000 : 30000,
    retryDelayMs = 600,
    concurrency = mobile ? 2 : 3,
  } = options

  let settledCount = 0
  let nextIndex = 0
  let finished = false
  const failed: string[] = []

  const report = () => {
    onProgress(Math.floor((settledCount / uniqueUrls.length) * 100))
    if (settledCount === uniqueUrls.length && !finished) {
      finished = true
      onDone(failed)
    }
  }

  const loadOnce = (url: string) =>
    new Promise<void>((resolve, reject) => {
      let img: HTMLImageElement | null = new Image()
      img.decoding = "async"
      const timer = window.setTimeout(() => {
        cleanup()
        reject(new Error(url))
      }, timeoutMs)
      const cleanup = () => {
        window.clearTimeout(timer)
        if (img) {
          img.onload = null
          img.onerror = null
          img.removeAttribute("src")
          img.src = ""
          img = null
        }
      }
      img.onload = () => {
        cleanup()
        resolve()
      }
      img.onerror = () => {
        cleanup()
        reject(new Error(url))
      }
      img.src = url
    })

  const loadWithRetry = async (url: string) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        await loadOnce(url)
        return
      } catch {
        if (attempt < retries) {
          await new Promise((r) =>
            setTimeout(r, retryDelayMs * (attempt + 1))
          )
        }
      }
    }
    failed.push(url)
  }

  const worker = async () => {
    while (true) {
      const current = nextIndex
      nextIndex += 1
      if (current >= uniqueUrls.length) return
      const url = uniqueUrls[current]
      try {
        await loadWithRetry(url)
      } catch {
        if (!failed.includes(url)) failed.push(url)
      }
      settledCount += 1
      report()
    }
  }

  const workerCount = Math.min(concurrency, uniqueUrls.length)
  for (let i = 0; i < workerCount; i++) {
    worker()
  }
}
