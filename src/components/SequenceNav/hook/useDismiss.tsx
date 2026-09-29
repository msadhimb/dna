import type { RefObject } from "react"
import { useEffect } from "react"

export const useDismiss = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void
) => {
  useEffect(() => {
    if (!active) return

    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [ref, active, onDismiss])
}
