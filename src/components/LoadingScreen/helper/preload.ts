export const preloadImages = (
  urls: string[],
  onProgress: (progress: number) => void,
  onDone: () => void
) => {
  if (urls.length === 0) {
    onProgress(100)
    setTimeout(onDone, 500)
    return
  }

  let loadedCount = 0
  let rafPending = false
  let lastReported = 0

  const reportProgress = () => {
    if (rafPending) return
    rafPending = true
    requestAnimationFrame(() => {
      rafPending = false
      const pct = Math.floor((loadedCount / urls.length) * 100)
      // only emit if changed to reduce React re-render thrash
      if (pct !== lastReported) {
        lastReported = pct
        onProgress(pct)
      }
      if (loadedCount === urls.length) onDone()
    })
  }

  const handleLoad = () => {
    loadedCount++
    reportProgress()
  }

  // Prioritaskan hero & frame pertama, sisanya di-batch agar tidak
  // decode 12 gambar paralel di mobile (main thread block + jank loading).
  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android/i.test(navigator.userAgent)
  const concurrency = isMobile ? 2 : 3

  const loadOne = (url: string) =>
    new Promise<void>((resolve) => {
      const img = new Image() as HTMLImageElement & { decoding?: string }
      // async decode: browser boleh decode off-main-thread / idle
      ;(img as any).decoding = "async"
      const done = () => {
        // Prefer decode() agar tidak block paint berikutnya
        const anyImg = img as any
        if (anyImg.decode) {
          anyImg
            .decode()
            .then(() => {
              handleLoad()
              resolve()
            })
            .catch(() => {
              handleLoad()
              resolve()
            })
        } else {
          handleLoad()
          resolve()
        }
      }
      img.onload = done
      img.onerror = done
      img.src = url
    })

  // Hanya preload via <link> untuk 2 URL pertama (kritis). Sisanya cukup Image()
  // agar tidak flood preload scanner.
  urls.slice(0, 2).forEach((url) => {
    try {
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "image"
      link.href = url
      // @ts-ignore
      link.fetchPriority = "high"
      document.head.appendChild(link)
    } catch {}
  })

  const runBatched = async () => {
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency)
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch.map(loadOne))
      // yield ke browser agar loading-screen GSAP & paint bisa jalan
      // di antara batch (vital di Android low-end)
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>((r) => {
        const ric = (window as any).requestIdleCallback as
          | ((cb: () => void, opts?: { timeout: number }) => number)
          | undefined
        if (ric) ric(() => r(), { timeout: 100 })
        else setTimeout(r, 32)
      })
    }
  }

  runBatched()
}
