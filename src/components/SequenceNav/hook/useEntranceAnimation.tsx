import type { RefObject } from "react"
import { useEffect, useRef } from "react"

export const useEntranceAnimation = (
  ref: RefObject<HTMLElement | null>,
  visible: boolean
) => {
  // Satu authored moment: main sekali saat pertama terlihat, bukan tiap
  // pengguna scroll keluar-masuk pinned intro.
  const playedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!visible || !el || playedRef.current) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    playedRef.current = true

    const anim = el.animate(
      [
        { opacity: "0", transform: "translateY(-10px)" },
        { opacity: "1", transform: "translateY(0)" },
      ],
      {
        duration: 700,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards",
      }
    )
    return () => anim.cancel()
  }, [ref, visible])
}
