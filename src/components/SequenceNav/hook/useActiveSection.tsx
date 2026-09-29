import { useEffect, useState } from "react"

export const useActiveSection = (ids: readonly string[]) => {
  const [activeId, setActiveId] = useState<string | null>(null)
  const key = ids.join("|")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [key])

  return activeId
}
