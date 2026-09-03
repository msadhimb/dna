import * as React from "react"
import { IconProps } from "./types"

interface OrnamentProps extends IconProps {
  /** Flip 180deg */
  flip?: boolean
}

/**
 * Ornament — thin divider with central dot and double arches.
 * viewBox 0 0 120 16
 * Default rendered at 100 x 14px (aspect 120:16). Pass size / width / height / color to customize.
 */
const Ornament = React.memo(function Ornament({
  color = "currentColor",
  size,
  width,
  height,
  flip = false,
  className,
  style,
  ...props
}: OrnamentProps) {
  // Resolve dimensions: default 100x14
  const defaultW = 100
  const defaultH = 14

  let w: string | number = width ?? (size != null ? size : defaultW)
  let h: string | number | undefined = height

  // If size is number and no explicit height, derive height proportionally
  if (size != null && width == null && height == null) {
    if (typeof size === "number") {
      w = size
      h = (size * 16) / 120
    } else {
      w = size
    }
  }
  if (h == null && width != null && size == null) {
    // if only width given, compute height
    if (typeof w === "number") h = (w * 16) / 120
  }
  if (h == null) h = defaultH
  if (typeof w === "number") w = `${w}px`
  if (typeof h === "number") h = `${h}px`

  return (
    <svg
      viewBox="0 0 120 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        width: w as string,
        height: h as string,
        color,
        transform: flip ? "rotate(180deg)" : undefined,
        ...style,
      }}
      {...props}
    >
      <path d="M0 8 H44 M76 8 H120" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="60" cy="8" r="3" fill="currentColor" />
      <path
        d="M48 8 C52 3,58 3,60 8 C62 3,68 3,72 8"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M48 8 C52 13,58 13,60 8 C62 13,68 13,72 8"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
    </svg>
  )
})

export { Ornament }
export default Ornament
