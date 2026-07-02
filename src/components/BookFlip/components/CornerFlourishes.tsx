import React from "react"
import { CORNER_POSITIONS } from "../helper/corner"
import CornerFlourish from "./CornerFlourish"

const CornerFlourishes = React.memo(function CornerFlourishes({
  color,
}: {
  color: string
}) {
  return (
    <>
      {CORNER_POSITIONS.map((pos) => (
        <CornerFlourish key={pos} color={color} position={pos} />
      ))}
    </>
  )
})

export default CornerFlourishes
