import { useGuest } from "@/store/useGuest"
import CornerFlourishes from "../components/CornerFlourishes"
import Ornament from "../components/Ornament"

export const defaultPages = ({ isDark }: { isDark: boolean }) => {
  const guest: any = useGuest.getState().guest

  const showBothDates = guest?.mantu_status && guest?.unduh_mantu_status

  return [
    <>
      <div className="flex flex-col gap-5 items-center">
        <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
        <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
        <span className="font-serif font-bold text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
          Hari Pernikahan
        </span>

        {showBothDates ? (
          <div className="flex flex-col items-center  gap-5">
            <div className="flex flex-col items-center">
              <span className="font-signature text-4xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                12 Desember 2026
              </span>
              <span className="font-serif text-2xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                9.00 AM - 3.00 PM
              </span>
            </div>

            <span className="font-serif text-xl font-bold tracking-[0.3em] uppercase text-[#9a865a] dark:text-[#a38d53]">
              &
            </span>

            <div className="flex flex-col items-center">
              <span className="font-signature text-4xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                26 Desember 2026
              </span>
              <span className="font-serif text-2xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
                9.00 AM - 3.00 PM
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="font-signature text-5xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
              {guest?.mantu_status ? "12 Desember 2026" : "26 Desember 2026"}
            </span>
            <span className="font-serif text-2xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
              9.00 AM - 3.00 PM
            </span>
          </div>
        )}

        <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
      </div>
    </>,
    <>
      <div className="flex flex-col gap-5 items-center">
        <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
        <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
        <span className="font-serif text-md tracking-[0.4em] font-bold text-[#9a865a] uppercase dark:text-[#a38d53]">
          Lokasi
        </span>
        <span className="font-signature text-3xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
          Gedung Pernikahan
        </span>

        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.645103116751!2d106.6326327!3d-6.178238399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f8d465b9f9c5%3A0x880e353b4abebf2f!2sDPD%20KNPI%20Tangerang!5e0!3m2!1sen!2sid!4v1786944064704!5m2!1sen!2sid"
          width="600"
          height="250"
          className="w-full max-w-sm overflow-hidden rounded-lg"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
      </div>
    </>,
  ]
}
