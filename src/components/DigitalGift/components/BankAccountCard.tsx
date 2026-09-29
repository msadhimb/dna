import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { CopyCheck, CopyIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const BankAccountCard = ({
  svg,
  accountNumber,
  accountName,
  bankLabel,
}: {
  svg: string
  accountNumber: string
  accountName: string
  bankLabel?: string
  accent?: string
  borderAccent?: string
  isDark?: boolean
  surface?: string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = accountNumber
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Card
      withCorners={false}
      withTopLine={false}
      radius="24px"
      className="dg-card group w-full md:w-80 items-stretch gap-0 overflow-hidden p-0 text-left transition-all duration-300 hover:-translate-y-1"
    >
      {/* Top strip */}
      <div className="flex items-center justify-between px-6 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-16 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-black/5 dark:ring-white/10">
            <Image
              src={svg}
              alt={bankLabel ?? "bank"}
              width={56}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-wedding-text-primary">
              {bankLabel ?? "Bank Transfer"}
            </span>
            <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-wedding-text-secondary">
              Tabungan
            </span>
          </div>
        </div>
        <span
          aria-live="polite"
          className={
            "rounded-full px-2.5 py-1 font-sans text-[10px] font-bold tracking-[0.12em] uppercase transition-colors " +
            (copied
              ? "bg-wedding-accent text-white"
              : "bg-wedding-accent/10 text-wedding-accent")
          }
        >
          {copied ? "Tersalin" : "Aktif"}
        </span>
      </div>

      {/* Number */}
      <div className="px-6 pt-5">
        <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-wedding-text-secondary">
          Nomor Rekening
        </p>
        <p className="mt-1.5 font-sans text-[19px] leading-snug font-semibold tracking-normal tabular-nums break-all text-wedding-text-primary select-all md:text-[20px]">
          {accountNumber}
        </p>
        <p className="mt-1.5 font-sans text-[11px] font-medium tracking-[0.08em] uppercase text-wedding-text-secondary">
          a.n. {accountName}
        </p>
      </div>

      {/* Action */}
      <div className="px-6 pt-4 pb-5">
        <Button
          onClick={handleCopy}
          size="sm"
          aria-live="polite"
          className="h-9 w-full rounded-full px-4 text-[10px] font-bold tracking-[0.14em] uppercase transition-all duration-200 focus-visible:ring-2 focus-visible:ring-wedding-accent focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] text-white dark:text-white"
          style={{ background: "var(--wedding-accent)" }}
        >
          {copied ? (
            <>
              <CopyCheck className="h-3.5 w-3.5" />
              Tersalin
            </>
          ) : (
            <>
              <CopyIcon className="h-3.5 w-3.5" />
              Salin Nomor
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}

export default BankAccountCard
