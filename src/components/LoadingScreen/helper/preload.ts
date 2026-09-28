interface PreloadOptions {
  /** Percobaan ulang per gambar setelah gagal/timeout. Default 3. */
  retries?: number
  /** Batas tunggu per percobaan (ms). Default 30000. */
  timeoutMs?: number
  /** Jeda dasar antar percobaan (ms, kelipatan per attempt). Default 600. */
  retryDelayMs?: number
}

/**
 * Preload gambar sampai benar-benar siap tampil:
 * - load + `decode()` eksplisit per gambar (bitmap siap -> anti blur/flash)
 * - tiap gambar di-retry bila gagal/timeout, bukan dihitung sukses palsu
 * - `onDone` dipanggil setelah SEMUA settled; daftar URL yang tetap gagal
 *   dikembalikan agar pemanggil bisa menanganinya (mis. putaran tambahan)
 */
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

  const { retries = 3, timeoutMs = 30000, retryDelayMs = 600 } = options
  let settledCount = 0
  const failed: string[] = []

  const report = () => {
    onProgress(Math.floor((settledCount / uniqueUrls.length) * 100))
    if (settledCount === uniqueUrls.length) onDone(failed)
  }

  const loadOnce = (url: string) =>
    new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.decoding = "async"
      const timer = window.setTimeout(() => {
        img.src = ""
        reject(new Error(`preload timeout: ${url}`))
      }, timeoutMs)
      img.onload = () => {
        window.clearTimeout(timer)
        // Tunggu hasil decode agar gambar siap penuh saat ditampilkan
        img
          .decode()
          .then(() => resolve())
          .catch(() => resolve())
      }
      img.onerror = () => {
        window.clearTimeout(timer)
        reject(new Error(`preload error: ${url}`))
      }
      img.src = url
    })

  const loadWithRetry = async (url: string) => {
    // SENGAJA tanpa <link rel="preload"> ke document.head: <head> dikelola
    // React (App Router) dan node asing di sana bisa merusak rekonsiliasi
    // head -> "Failed to execute 'insertBefore' on 'Node'".
    // Fetch via `new Image()` di bawah sudah mengisi HTTP cache dengan
    // URL yang sama sehingga next/image (unoptimized) langsung cache-hit.
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

  uniqueUrls.forEach((url) => {
    loadWithRetry(url)
      .catch(() => {
        if (!failed.includes(url)) failed.push(url)
      })
      .finally(() => {
        settledCount++
        report()
      })
  })
}
