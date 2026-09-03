export function OrnamentalDivider({
  color = "var(--wedding-border-accent)",
  size = "default",
}: {
  color?: string
  size?: "default" | "small"
}) {
  const w = size === "small" ? "80px" : "120px"
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1" style={{ background: color }} />
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path
          d="M10 2 L18 6 L10 10 L2 6 Z"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.6"
        />
        <circle cx="10" cy="6" r="1.5" fill={color} />
      </svg>
      <div className="h-px flex-1" style={{ background: color }} />
    </div>
  )
}
