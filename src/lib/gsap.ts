import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

let isRegistered = false

export const registerGSAP = () => {
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

if (typeof window !== "undefined") {
  registerGSAP()
}

export { gsap, ScrollTrigger }
