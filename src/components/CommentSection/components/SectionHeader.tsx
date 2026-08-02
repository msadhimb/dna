interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  accent: string
  textSecondary: string
  textPrimary: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  accent,
  textSecondary,
}: SectionHeaderProps) {
  return (
    <div className="mb-20 flex flex-col items-center gap-6 text-center">
      <p
        className="cs-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase"
        style={{ color: textSecondary }}
      >
        {eyebrow}
      </p>

      <div
        className="cs-title-word font-signature leading-none font-bold"
        style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)" }}
      >
        {title}
      </div>

      <div className="cs-line-deco flex w-full max-w-xs items-center gap-4">
        <span
          className="cs-float-line h-px flex-1"
          style={{
            background: `linear-gradient(to right, transparent, ${accent})`,
          }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: accent }}
        />
        <span
          className="cs-float-line h-px flex-1"
          style={{
            background: `linear-gradient(to left, transparent, ${accent})`,
          }}
        />
      </div>

      <p
        className="cs-desc max-w-md font-sans text-sm leading-relaxed"
        style={{ color: textSecondary }}
      >
        {description}
      </p>
    </div>
  )
}
