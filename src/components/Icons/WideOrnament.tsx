import * as React from "react"
import { IconProps } from "./types"

interface WideOrnamentProps extends IconProps {
  flip?: boolean
}

/**
 * WideOrnament — stretched divider with zigzag center.
 * viewBox 0 0 200 12
 * Default 100% width x 10px height. Customize via size / width / height / color.
 */
const WideOrnament = React.memo(function WideOrnament({
  color = "currentColor",
  size,
  width,
  height,
  flip = false,
  className,
  style,
  ...props
}: WideOrnamentProps) {
  const w = width ?? size ?? "100%"
  const h = height ?? 10

  const widthStr = typeof w === "number" ? `${w}px` : (w as string)
  const heightStr = typeof h === "number" ? `${h}px` : (h as string)

  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        width: widthStr,
        height: heightStr,
        color,
        transform: flip ? "rotate(180deg)" : undefined,
        display: "block",
        ...style,
      }}
      {...props}
    >
      <path d="M0 6 H70 M130 6 H200" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
      <path
        d="M75 6 L80 2 L85 6 L90 2 L95 6 L100 2 L105 6 L110 2 L115 6 L120 2 L125 6"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      <circle cx="100" cy="6" r="2" fill="currentColor" opacity="0.8" />
    </svg>
  )
})

export { WideOrnament }
export default WideOrnament
