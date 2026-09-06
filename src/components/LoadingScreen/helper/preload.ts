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

  const handleLoad = () => {
    loadedCount++
    onProgress(Math.floor((loadedCount / urls.length) * 100))
    if (loadedCount === urls.length) onDone()
  }

  urls.forEach((url) => {
    const link = document.createElement("link")
    link.rel = "preload"
    link.as = "image"
    link.href = url
    document.head.appendChild(link)

    const img = new Image()
    img.src = url
    img.onload = handleLoad
    img.onerror = handleLoad
  })
}
