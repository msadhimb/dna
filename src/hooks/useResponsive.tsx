import React from "react"
import { useScreenWidth } from "./useScreenWidth"

const useResponsive = () => {
  const screenWidth = useScreenWidth()
  const isMobile = screenWidth > 0 && screenWidth < 768

  const dist = (mobileVal: string, desktopVal: string) =>
    isMobile ? mobileVal : desktopVal

  return {
    isMobile,
    dist,
  }
}

export default useResponsive
