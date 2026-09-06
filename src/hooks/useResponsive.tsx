import { useScreenWidth } from "./useScreenWidth"
import { useState, useEffect } from "react"

const useResponsive = () => {
  const screenWidth = useScreenWidth()
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const update = () => setIsPortrait(window.innerHeight > window.innerWidth)
    update()
    window.addEventListener("resize", update)
    window.addEventListener("orientationchange", update)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("orientationchange", update)
    }
  }, [])

  // iPad portrait ≤1024 + portrait = mobile, landscape = desktop
  const isMobile = screenWidth > 0 && (screenWidth < 768 || (screenWidth <= 1024 && isPortrait))
  const isIpadPortrait = screenWidth >= 768 && screenWidth <= 1024 && isPortrait

  const dist = (mobileVal: string, desktopVal: string) => (isMobile ? mobileVal : desktopVal)

  return { isMobile, isIpadPortrait, isPortrait, dist }
}

export default useResponsive
