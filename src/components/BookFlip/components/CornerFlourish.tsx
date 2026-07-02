import React from "react"
import { CORNER_POS, CORNER_POSITIONS, CORNER_ROT } from "../helper/corner"

const CornerFlourish = React.memo(function CornerFlourish({
  color,
  position,
}: {
  color: string
  position: (typeof CORNER_POSITIONS)[number]
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      style={{
        width: 16,
        height: 16,
        color,
        position: "absolute",
        transform: `rotate(${CORNER_ROT[position]})`,
        opacity: 0.45,
        ...CORNER_POS[position],
      }}
      fill="none"
    >
      <path d="M2 18 L2 2 L18 2" stroke="currentColor" strokeWidth="0.8" />
      <path d="M2 8 C2 4,6 2,8 2" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
})

export default CornerFlourish
