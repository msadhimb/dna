import React from "react"

const RibbonStrap = React.memo(function RibbonStrap({
  color,
}: {
  color: string
}) {
  return (
    <div
      style={{
        width: "11px",
        height: "44px",
        background: `linear-gradient(to bottom, ${color}, ${color}bb)`,
        borderRadius: "0 0 5px 5px",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "2px",
          width: "3px",
          height: "65%",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "2px",
        }}
      />
    </div>
  )
})

export default RibbonStrap
