import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let isRegistered = false

export function registerGSAP() {
  if (isRegistered) return
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    })
  }
  isRegistered = true
}

// Auto-register saat modul di-import di client
if (typeof window !== "undefined") {
  registerGSAP()
}

// Re-export for convenience
export { gsap, ScrollTrigger }
