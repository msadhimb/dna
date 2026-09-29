import { useEffect, useState } from "react"

/**
 * True setelah pengguna lolos dari pinned intro (#master-trigger) dan
 * mendekati #time-and-place. Dipakai agar SequenceNav tidak tampil di atas
 * CurtainTransition / BioSequence / LoveJourney — ia baru muncul saat
 * konten reguler dimulai.
 */
export const usePastIntro = () => {
  const [pastIntro, setPastIntro] = useState(false)

  useEffect(() => {
    const check = () => {
      const el = document.getElementById("time-and-place")
      if (!el) {
        setPastIntro(false)
        return
      }
      setPastIntro(el.getBoundingClientRect().top <= window.innerHeight * 0.85)
    }

    check()
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  return pastIntro
}
