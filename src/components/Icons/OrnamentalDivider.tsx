import * as React from "react"

interface OrnamentalDividerProps {
  
  color?: string
  
  accent?: string
  
  size?: "default" | "small" | number | string
  className?: string
  style?: React.CSSProperties
}


export function OrnamentalDivider({
  color = "var(--wedding-border-accent)",
  accent,
  size = "default",
  className,
  style,
}: OrnamentalDividerProps) {
  const finalColor = accent ?? color

  
  const isPreset = size === "default" || size === "small"
  const containerWidth = isPreset ? (size === "small" ? "80px" : "120px") : undefined
  const svgSize = isPreset ? undefined : size

  return (
    <div
      className={`flex items-center gap-3 ${className ?? ""}`}
      style={{ ...(containerWidth ? { width: containerWidth } : {}), ...style, ...(isPreset ? {} : { width: "100%" }) }}
    >
      <div className="h-px flex-1" style={{ background: finalColor }} />
      <svg
        width={typeof svgSize === "number" ? svgSize : typeof svgSize === "string" ? svgSize : 20}
        height={typeof svgSize === "number" ? Math.round((svgSize as number) * 0.6) : 12}
        viewBox="0 0 20 12"
        fill="none"
        style={{ color: finalColor, flexShrink: 0 }}
        aria-hidden="true"
      >
        <path
          d="M10 2 L18 6 L10 10 L2 6 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
        <circle cx="10" cy="6" r="1.5" fill="currentColor" />
      </svg>
      <div className="h-px flex-1" style={{ background: finalColor }} />
    </div>
  )
}

export default OrnamentalDivider
