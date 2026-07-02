import React from "react"

const Ornament = React.memo(function Ornament({
  color,
  flip = false,
}: {
  color: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 120 16"
      style={{
        width: "100px",
        height: "14px",
        color,
        transform: flip ? "rotate(180deg)" : undefined,
      }}
      fill="none"
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

export default Ornament
