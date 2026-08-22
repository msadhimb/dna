import CornerFlourishes from "../components/CornerFlourishes"
import Ornament from "../components/Ornament"

export const defaultPages = ({ isDark }: { isDark: boolean }) => {
  return [
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
        Hari Pernikahan
      </span>
      <span className="font-signature text-5xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        12 Desember 2026
      </span>
      <span className="font-serif text-[clamp(1.1rem,2.5vw,1.8rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        9.00 AM - 3.00 PM
      </span>
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
    </>,
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
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
    </>,
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
        sdfsdf
      </span>
      <span className="font-signature text-5xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        dfgdgdgdgf
      </span>
      <span className="font-serif text-[clamp(1.1rem,2.5vw,1.8rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        kontolodon
      </span>
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
    </>,
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-[10px] tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
        Lokasi
      </span>
      <span className="font-signature text-3xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        Gedung Pernikahan
      </span>

      <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
    </>,
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
        Hari Pernikahan
      </span>
      <span className="font-signature text-5xl leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        12 Desember 2026
      </span>
      <span className="font-serif text-[clamp(1.1rem,2.5vw,1.8rem)] leading-tight text-[#1e1a14] dark:text-[#e0d8d0]">
        9.00 AM - 3.00 PM
      </span>
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} flip />
    </>,
    <>
      <CornerFlourishes color={isDark ? "#d4af37" : "#c9a227"} />
      <Ornament color={isDark ? "#d4af37" : "#c9a227"} />
      <span className="font-serif text-md tracking-[0.4em] text-[#9a865a] uppercase dark:text-[#a38d53]">
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
    </>,
  ]
}
