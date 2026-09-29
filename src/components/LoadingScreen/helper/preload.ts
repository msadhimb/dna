interface PreloadOptions {
  /** Percobaan ulang per gambar setelah gagal/timeout. Default 3. */
  retries?: number
  /** Batas tunggu per percobaan (ms). Default 30000. */
  timeoutMs?: number
  /** Jeda dasar antar percobaan (ms, kelipatan per attempt). Default 600. */
  retryDelayMs?: number
  /**
   * Maksimum unduhan paralel. Default 4.
   * Semua URL sekaligus = spike CPU/memori (terutama iOS Safari yang
   * gampang jetsam) + server men-throttle. Antrean worker pool menahannya.
   */
  concurrency?: number
  /**
   * Paksa `decode()` bitmap penuh tiap gambar saat preload.
   * Default false: onload saja (byte ter-cache, decode ditunda sampai
   * gambar benar-benar dirender). decode() serentak untuk belasan foto
   * 24MP = ratusan MB bitmap hidup bersamaan -> tab mobile mati
   * ("A problem repeatedly occurred").
   */
  forceDecode?: boolean
}

/**
 * Preload gambar sampai benar-benar siap tampil:
 * - antrean paralel terbatas (default 4) agar tidak spike memori/CPU
 * - tanpa `decode()` paksa kecuali diminta (decode on-demand saat render)
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

  const {
    retries = 3,
    timeoutMs = 30000,
    retryDelayMs = 600,
    concurrency = 4,
    forceDecode = false,
  } = options
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
      const cleanup = () => {
        img.onload = null
        img.onerror = null
      }
      const timer = window.setTimeout(() => {
        cleanup()
        img.src = ""
        reject(new Error(`preload timeout: ${url}`))
      }, timeoutMs)
      img.onload = () => {
        window.clearTimeout(timer)
        cleanup()
        if (forceDecode) {
          // Bitmap penuh di-decode sekarang (mahal!) — hanya untuk gambar
          // kritis above-the-fold bila benar-benar dibutuhkan.
          img
            .decode()
            .then(() => resolve())
            .catch(() => resolve())
        } else {
          resolve()
        }
      }
      img.onerror = () => {
        window.clearTimeout(timer)
        cleanup()
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

  const queue = [...uniqueUrls]
  const workerCount = Math.max(1, Math.min(concurrency, queue.length))
  const workers = Array.from({ length: workerCount }, async () => {
    while (queue.length > 0) {
      const url = queue.shift()
      if (!url) break
      await loadWithRetry(url)
        .catch(() => {
          if (!failed.includes(url)) failed.push(url)
        })
        .finally(() => {
          settledCount++
          report()
        })
    }
  })
  void Promise.all(workers)
}
