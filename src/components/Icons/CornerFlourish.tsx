import * as React from "react"
import { IconProps } from "./types"

export const CORNER_POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const
export type CornerPosition = (typeof CORNER_POSITIONS)[number]

export const CORNER_ROT: Record<CornerPosition, string> = {
  "top-left": "0",
  "top-right": "90deg",
  "bottom-right": "180deg",
  "bottom-left": "270deg",
}

export const CORNER_POS: Record<CornerPosition, React.CSSProperties> = {
  "top-left": { top: 10, left: 10 },
  "top-right": { top: 10, right: 10 },
  "bottom-right": { bottom: 10, right: 10 },
  "bottom-left": { bottom: 10, left: 10 },
}

interface CornerFlourishProps extends IconProps {
  position?: CornerPosition
  
  pos?: CornerPosition
  opacity?: number
}


const CornerFlourish = React.memo(function CornerFlourish({
  color = "currentColor",
  size = 16,
  position,
  pos,
  opacity = 0.45,
  className,
  style,
  ...props
}: CornerFlourishProps) {
  const finalPos = position ?? pos

  const resolvedSize = typeof size === "number" ? `${size}px` : (size as string)
  const sizeNum = typeof size === "number" ? size : 16

  const rotation = finalPos ? CORNER_ROT[finalPos] : undefined
  const posStyle = finalPos ? CORNER_POS[finalPos] : {}

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        color,
        position: finalPos ? "absolute" : undefined,
        transform: rotation ? `rotate(${rotation})` : undefined,
        opacity,
        ...posStyle,
        ...style,
      }}
      {...props}
    >
      <path d="M2 18 L2 2 L18 2" stroke="currentColor" strokeWidth="0.8" />
      <path d="M2 8 C2 4,6 2,8 2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
})

export { CornerFlourish }
export default CornerFlourish
