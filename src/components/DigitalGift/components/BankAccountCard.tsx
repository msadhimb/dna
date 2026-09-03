import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { CopyCheck, CopyIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const BankAccountCard = ({
  svg,
  accountNumber,
  accountName,
}: {
  svg: string
  accountNumber: string
  accountName: string
  
  accent?: string
  
  borderAccent?: string
  
  isDark?: boolean
  
  surface?: string
}) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <Card className="dg-card group w-full md:w-80 items-center gap-3 px-8 py-7 text-center transition-all duration-300">
      <Image src={svg} alt="bank" width={80} height={100} />

      
      <p
        className="font-signature font-bold tracking-[0.08em] text-muted dark:text-secondary"
        style={{
          fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
        }}
      >
        {accountNumber}
      </p>

      
      <div className="flex items-center gap-2">
        <div className="h-px w-8 bg-wedding-border-accent" />
        <div className="h-1.5 w-1.5 rotate-45 bg-wedding-accent opacity-60" />
        <div className="h-px w-8 bg-wedding-border-accent" />
      </div>

      
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
        a.n. {accountName}
      </p>

      
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
    </Card>
  )
}

export default BankAccountCard
