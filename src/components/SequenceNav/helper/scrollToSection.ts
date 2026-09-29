/** Id awal pinned story — titik "Putar Our Story" selalu mulai dari sini. */
export const STORY_START_ID = "master-trigger"

/** Offset atas per section agar judul tidak tertutup nav (single source). */
const offsetFor = (id: string) => {
  if (id === STORY_START_ID) return 0 // pin start "top top": harus presisi
  if (id === "time-and-place") return 0
  return 80
}

/** Posisi Y absolut sebuah section dengan offset nav — dipakai juga oleh autoplay. */
export const getSectionY = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return null
  const y = el.getBoundingClientRect().top + window.scrollY - offsetFor(id)
  return Math.max(0, y)
}

export const scrollToSection = (
  id: string,
  behavior: ScrollBehavior = "smooth"
) => {
  const y = getSectionY(id)
  if (y === null) return
  window.scrollTo({ top: y, behavior })
}
