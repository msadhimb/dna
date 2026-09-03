interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  /** @deprecated — terpusat via Tailwind `text-wedding-text-secondary` */
  textSecondary?: string
  /** @deprecated */
  textPrimary?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="cs-eyebrow font-sans text-[10px] font-semibold tracking-[0.5em] uppercase text-wedding-text-secondary">
        {eyebrow}
      </p>

      <div
        className="cs-title-word font-signature leading-none font-bold text-wedding-text-primary"
        style={{ fontSize: "clamp(3.5rem, 10vw, 6rem)" }}
      >
        {title}
      </div>

      <p className="cs-desc max-w-md font-sans text-sm leading-relaxed text-wedding-text-secondary">
        {description}
      </p>
    </div>
  )
}
