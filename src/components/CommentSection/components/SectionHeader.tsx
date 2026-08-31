interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  textSecondary: string
  textPrimary: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  textSecondary,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
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

      <p
        className="cs-desc max-w-md font-sans text-sm leading-relaxed"
        style={{ color: textSecondary }}
      >
        {description}
      </p>
    </div>
  )
}
