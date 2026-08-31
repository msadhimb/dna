import { useGuest } from "@/store/useGuest"
import CornerFlourishes from "../components/CornerFlourishes"
import Ornament from "../components/Ornament"

export const defaultPages = ({ isDark }: { isDark: boolean }) => {
  const guest: any = useGuest.getState().guest

  const showBothDates = guest?.mantu_status && guest?.unduh_mantu_status

  return [
    <>
      <div className="flex flex-col gap-3 sm:gap-5 items-center max-[390px]:gap-3">
        <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
        <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
        <span className="font-serif font-bold text-[clamp(10px,2.6vw,13px)] sm:text-sm tracking-[0.32em] sm:tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
          Hari Pernikahan
        </span>

        {showBothDates ? (
          <div className="flex flex-col items-center gap-3 sm:gap-5 max-[390px]:gap-2.5">
            <div className="flex flex-col items-center">
              <span className="font-signature leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-4xl">
                12 Desember 2026
              </span>
              <span className="font-serif leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(0.9rem,3.6vw,1.5rem)] sm:text-2xl">
                9.00 AM - 3.00 PM
              </span>
            </div>

            <span className="font-serif font-bold tracking-[0.3em] uppercase text-[#9a865a] dark:text-[#a38d53] text-[clamp(0.8rem,3vw,1.25rem)] sm:text-xl">
              &
            </span>

            <div className="flex flex-col items-center">
              <span className="font-signature leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(1.45rem,6.4vw,2.25rem)] sm:text-4xl">
                26 Desember 2026
              </span>
              <span className="font-serif leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(0.9rem,3.6vw,1.5rem)] sm:text-2xl">
                9.00 AM - 3.00 PM
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="font-signature leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(1.7rem,7.2vw,3rem)] sm:text-5xl">
              {guest?.mantu_status ? "12 Desember 2026" : "26 Desember 2026"}
            </span>
            <span className="font-serif leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(0.95rem,3.8vw,1.5rem)] sm:text-2xl">
              9.00 AM - 3.00 PM
            </span>
          </div>
        )}

        <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
      </div>
    </>,
    <>
      <div className="flex flex-col gap-3 sm:gap-5 items-center max-[390px]:gap-3 w-full">
        <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
        <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
        <span className="font-serif tracking-[0.32em] sm:tracking-[0.4em] font-bold text-[#9a865a] uppercase dark:text-[#a38d53] text-[clamp(10px,2.6vw,13px)] sm:text-sm">
          Lokasi
        </span>
        <span className="font-signature leading-tight text-[#1e1a14] dark:text-[#e0d8d0] text-[clamp(1.3rem,5.6vw,1.875rem)] sm:text-3xl">
          Gedung Pernikahan
        </span>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.645103116751!2d106.6326327!3d-6.178238399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8d465b9f9c5%3A0x880e353b4abebf2f!2sDPD%20KNPI%20Tangerang!5e0!3m2!1sen!2sid!4v1786944064704!5m2!1sen!2sid"
          width="600"
          height="250"
          className="w-full max-w-sm overflow-hidden rounded-lg h-[clamp(145px,38vw,250px)] sm:h-[250px] max-[390px]:h-[150px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
      </div>
    </>,
  ]
}
