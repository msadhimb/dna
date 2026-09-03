import * as React from "react"
import { IconProps } from "./types"

interface FloralOrnamentProps extends IconProps {
  /** @deprecated use color */
  accent?: string
}

/**
 * FloralOrnament — decorative divider with circular center and leaf petals.
 * viewBox 0 0 120 24
 */
export function FloralOrnament({
  size,
  width,
  height,
  color = "currentColor",
  accent,
  className = "",
  style,
  ...props
}: FloralOrnamentProps) {
  const finalColor = accent ?? color

  const resolvedWidth = width ?? size ?? undefined
  const resolvedHeight = height ?? (size != null ? undefined : undefined)

  // Default: let CSS control size via className, but allow size to set width
  const svgStyle: React.CSSProperties = {
    color: finalColor,
    ...(resolvedWidth != null ? { width: typeof resolvedWidth === "number" ? `${resolvedWidth}px` : resolvedWidth } : {}),
    ...(resolvedHeight != null
      ? { height: typeof resolvedHeight === "number" ? `${resolvedHeight}px` : resolvedHeight }
      : {}),
    ...style,
  }

  // If size is number, keep aspect ratio 120:24 = 5:1
  if (size != null && width == null && height == null && typeof size === "number") {
    svgStyle.width = `${size}px`
    svgStyle.height = `${(size * 24) / 120}px`
  }

  return (
    <svg
      viewBox="0 0 120 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      style={svgStyle}
      {...props}
    >
      <path d="M2 12 H40" />
      <path d="M80 12 H118" />
      <circle cx="60" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M60 12 C52 4, 44 4, 40 12 C44 20, 52 20, 60 12 Z" />
      <path d="M60 12 C68 4, 76 4, 80 12 C76 20, 68 20, 60 12 Z" />
    </svg>
  )
}

export default FloralOrnament
