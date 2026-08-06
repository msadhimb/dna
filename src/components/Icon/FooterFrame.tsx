/**
 * FooterFrame — ornamental frame SVG that wraps the couple's names.
 * Renders inline at the given width.
 */
export function FooterFrame({
  accent,
  isDark,
  width = 320,
}: {
  accent: string
  isDark: boolean
  width?: number
}) {
  const h = width * 0.55
  const cx = width / 2
  const strokeColor = accent
  const fillColor = isDark ? "#0A0A0A" : "#F8F5EE"
  const innerColor = isDark ? "#161616" : "#F0EBE0"

  return (
    <svg
      width={width}
      height={h}
      viewBox={`0 0 ${width} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto block drop-shadow-sm"
    >
      {/* Outer shadow */}
      <rect
        x={cx - width / 2 + 4}
        y={4}
        width={width - 8}
        height={h - 8}
        rx="8"
        fill={isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}
      />

      {/* Outer border */}
      <rect
        x={cx - width / 2}
        y="0"
        width={width - 8}
        height={h - 8}
        rx="6"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      {/* Inner inset border */}
      <rect
        x={cx - width / 2 + 10}
        y="10"
        width={width - 28}
        height={h - 28}
        rx="4"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeOpacity="0.25"
      />

      {/* Top-left corner ornament */}
      <path
        d={`M ${cx - width / 2 + 10} 28 Q ${cx - width / 2 + 10} 10 ${cx - width / 2 + 28} 10`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle
        cx={cx - width / 2 + 19}
        cy="19"
        r="2"
        fill={strokeColor}
        opacity="0.5"
      />

      {/* Top-right corner ornament */}
      <path
        d={`M ${cx + width / 2 - 18} 10 Q ${cx + width / 2 - 10} 10 ${cx + width / 2 - 10} 28`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle
        cx={cx + width / 2 - 19}
        cy="19"
        r="2"
        fill={strokeColor}
        opacity="0.5"
      />

      {/* Bottom-left corner ornament */}
      <path
        d={`M ${cx - width / 2 + 10} ${h - 19} Q ${cx - width / 2 + 10} ${h - 11} ${cx - width / 2 + 28} ${h - 11}`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle
        cx={cx - width / 2 + 19}
        cy={h - 19}
        r="2"
        fill={strokeColor}
        opacity="0.5"
      />

      {/* Bottom-right corner ornament */}
      <path
        d={`M ${cx + width / 2 - 18} ${h - 11} Q ${cx + width / 2 - 10} ${h - 11} ${cx + width / 2 - 10} ${h - 19}`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle
        cx={cx + width / 2 - 19}
        cy={h - 19}
        r="2"
        fill={strokeColor}
        opacity="0.5"
      />

      {/* Center diamond ornament */}
      <path
        d={`M ${cx} ${h * 0.18} L ${cx + 8} ${h * 0.24} L ${cx} ${h * 0.3} L ${cx - 8} ${h * 0.24} Z`}
        fill={strokeColor}
        opacity="0.5"
      />
      <path
        d={`M ${cx} ${h * 0.70} L ${cx + 8} ${h * 0.76} L ${cx} ${h * 0.82} L ${cx - 8} ${h * 0.76} Z`}
        fill={strokeColor}
        opacity="0.5"
      />
    </svg>
  )
}
