import * as React from "react"

interface TopBorderProps {
  /** Accent color */
  color?: string
  /** @deprecated alias */
  accent?: string
  /** Width in px (viewBox 280x24) */
  size?: number | string
  /** @deprecated alias for size */
  width?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * TopBorder — ornamental top border SVG for footer section.
 * viewBox 0 0 280 24. Customize via size (width) and color.
 */
export function TopBorder({
  color,
  accent,
  size,
  width: widthProp,
  className,
  style,
}: TopBorderProps) {
  const raw = size ?? widthProp ?? 280
  const widthNum = typeof raw === "number" ? raw : parseInt(raw as string, 10) || 280
  const stroke = color ?? accent ?? "currentColor"

  return (
    <svg
      width={widthNum}
      height="24"
      viewBox="0 0 280 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto block ${className ?? ""}`}
      style={{ color: stroke, ...style }}
      aria-hidden="true"
    >
      {/* Left arm */}
      <line x1="0" y1="12" x2="108" y2="12" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />
      {/* Right arm */}
      <line x1="172" y1="12" x2="280" y2="12" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5" />

      {/* Center diamond */}
      <path
        d="M140 4 L148 12 L140 20 L132 12 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.7"
        fill="none"
      />
      <circle cx="140" cy="12" r="2.5" fill="currentColor" opacity="0.6" />

      {/* Side diamonds */}
      <path
        d="M108 12 L113 9 L118 12 L113 15 Z"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.4"
        fill="none"
      />
      <path
        d="M172 12 L167 9 L162 12 L167 15 Z"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* End dots */}
      <circle cx="118" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
      <circle cx="162" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

export default TopBorder
