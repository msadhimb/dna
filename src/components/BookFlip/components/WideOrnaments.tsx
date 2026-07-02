import React from "react"

const WideOrnament = React.memo(function WideOrnament({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 200 12"
      style={{
        width: "100%",
        height: "10px",
        color,
        transform: flip ? "rotate(180deg)" : undefined,
      }}
      fill="none"
    >
      <path
        d="M0 6 H70 M130 6 H200"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.8"
      />
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

export default WideOrnament
