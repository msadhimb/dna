import React, { forwardRef } from "react"

interface CoverBackProps {
  background: string
}


const CoverBack = forwardRef<HTMLDivElement, CoverBackProps>(
  ({ background }, ref) => {
    return (
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0"
        style={{ background }}
        aria-hidden="true"
      />
    )
  }
)

CoverBack.displayName = "CoverBack"
export default CoverBack
