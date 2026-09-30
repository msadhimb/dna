
export const STORY_START_ID = "master-trigger"

const offsetFor = (id: string) => {
  if (id === STORY_START_ID) return 0
  if (id === "time-and-place") return 0
  return 80
}

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
