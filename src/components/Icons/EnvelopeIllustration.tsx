import * as React from "react"

interface EnvelopeIllustrationProps {
  /** Main accent color */
  color?: string
  /** @deprecated alias */
  accent?: string
  /** Dark mode variant */
  isDark?: boolean
  /** Width in px (default 200, height 0.7*width) */
  size?: number | string
  className?: string
  style?: React.CSSProperties
}

/**
 * EnvelopeIllustration — decorative envelope with letter peeking out and wax seal.
 * Customize via size (width) and color. isDark switches paper palette.
 */
export function EnvelopeIllustration({
  color,
  accent,
  isDark = false,
  size = 200,
  className,
  style,
}: EnvelopeIllustrationProps) {
  const fill = color ?? accent ?? "var(--wedding-accent)"
  const paper = isDark ? "#1A1A1A" : "#F0EBE0"
  const paperEdge = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"

  const widthNum = typeof size === "number" ? size : parseInt(size as string, 10) || 200
  const heightNum = (widthNum * 140) / 200
  const scale = widthNum / 200

  return (
    <div
      className={`relative flex items-center justify-center py-2 ${className ?? ""}`}
      style={style}
    >
      <svg
        width={widthNum}
        height={heightNum}
        viewBox="0 0 200 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
        aria-hidden="true"
      >
        {/* Shadow */}
        <ellipse cx="100" cy="132" rx="72" ry="6" fill={isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.12)"} />

        {/* Envelope body */}
        <rect
          x="18"
          y="52"
          width="164"
          height="78"
          rx="6"
          fill={isDark ? "#141414" : "#E8E0D4"}
          stroke={fill}
          strokeWidth="1"
          strokeOpacity="0.4"
        />

        {/* Envelope flap (open — pointing up) */}
        <path
          d="M18 58 L100 20 L182 58"
          fill={isDark ? "#1C1C1C" : "#EDE5D8"}
          stroke={fill}
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeLinejoin="round"
        />

        {/* Inner flap shadow */}
        <path
          d="M22 57 L100 24 L178 57"
          fill="none"
          stroke={paperEdge}
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Letter / card peeking out */}
        <rect
          x="36"
          y="36"
          width="128"
          height="70"
          rx="4"
          fill={paper}
          stroke={fill}
          strokeWidth="0.75"
          strokeOpacity="0.5"
        />

        {/* Decorative lines on letter */}
        <line x1="52" y1="56" x2="148" y2="56" stroke={fill} strokeWidth="0.75" strokeOpacity="0.3" />
        <line x1="60" y1="64" x2="140" y2="64" stroke={fill} strokeWidth="0.75" strokeOpacity="0.2" />
        <line x1="66" y1="72" x2="134" y2="72" stroke={fill} strokeWidth="0.75" strokeOpacity="0.15" />

        {/* Wax seal on letter */}
        <circle cx="100" cy="90" r="12" fill={fill} opacity="0.9" />
        <circle
          cx="100"
          cy="90"
          r="9"
          fill="none"
          stroke={isDark ? "rgba(245,220,200,0.2)" : "rgba(255,245,230,0.25)"}
          strokeWidth="0.75"
        />
        <text
          x="100"
          y="93"
          textAnchor="middle"
          fontSize="7"
          fontWeight="bold"
          fill={isDark ? "#F5DCC8" : "#FFF5E6"}
          fontFamily="var(--font-signature), serif"
        >
          D&amp;A
        </text>

        {/* Corner fold on envelope body */}
        <path d="M18 52 L18 58 L24 52 Z" fill={isDark ? "#101010" : "#D8D0C4"} />
        <path d="M182 52 L176 52 L182 58 Z" fill={isDark ? "#101010" : "#D8D0C4"} />
      </svg>

      {/* Floating ornament */}
      <div
        className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] opacity-20"
        style={{ color: fill }}
      >
        ✦
      </div>
    </div>
  )
}

export default EnvelopeIllustration
