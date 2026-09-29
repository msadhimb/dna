export const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return

  const rect = el.getBoundingClientRect()

  // Center hanya jika section muat di layar; kalau tidak, jatuh ke align top.
  const y = rect.top + window.scrollY - (id === "time-and-place" ? 0 : 80)
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" })
}
