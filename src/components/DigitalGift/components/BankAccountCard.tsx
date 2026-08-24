import { Button } from "@/components/Button"
import { CopyCheck, CopyIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const BankAccountCard = ({
  svg,
  accountNumber,
  accountName,
  accent,

  borderAccent,
  isDark,
}: {
  svg: string
  accountNumber: string
  accountName: string
  accent: string

  borderAccent: string
  isDark: boolean
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div
      className="dg-card group relative w-full md:w-100 flex flex-col items-center gap-3 px-8 py-7 text-center transition-all duration-300"
      style={{
        border: `1px solid ${borderAccent}`,
        borderRadius: "12px",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute left-6 right-6 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Corner ornaments */}
      <div
        className="absolute left-3 top-3 text-[8px] opacity-20"
        style={{ color: accent }}
      >
        ❧
      </div>
      <div
        className="absolute right-3 top-3 text-[8px] opacity-20"
        style={{ color: accent, transform: "scaleX(-1)" }}
      >
        ❧
      </div>

      <Image src={svg} alt="bank" width={80} height={100} />

      {/* Account number */}
      <p
        className="font-signature font-bold tracking-[0.08em] text-muted dark:text-secondary"
        style={{
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
        }}
      >
        {accountNumber}
      </p>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="h-px w-8" style={{ background: borderAccent }} />
        <div
          className="h-1.5 w-1.5 rotate-45"
          style={{ background: accent, opacity: 0.6 }}
        />
        <div className="h-px w-8" style={{ background: borderAccent }} />
      </div>

      {/* Account name */}
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
        a.n. {accountName}
      </p>

      {/* Copy button */}
      <Button
        onClick={handleCopy}
        size="sm"
        className="mt-2 flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-200 text-muted dark:text-white"
      >
        {copied ? (
          <>
            <CopyCheck />
            Tersalin
          </>
        ) : (
          <>
            <CopyIcon />
            Salin No. Rek
          </>
        )}
      </Button>
    </div>
  )
}

export default BankAccountCard
