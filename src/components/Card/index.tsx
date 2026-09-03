import * as React from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  withTopLine?: boolean
  withCorners?: boolean
  radius?: string
  
  accent?: string
  
  borderAccent?: string
  
  isDark?: boolean
  
  surface?: string
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      style,
      withTopLine = true,
      withCorners = true,
      radius = "20px",
      
      accent: _accent,
      borderAccent: _borderAccent,
      isDark: _isDark,
      surface: _surface,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col bg-wedding-surface border border-wedding-border-accent shadow-wedding-card",
          className
        )}
        style={{
          borderRadius: radius,
          ...style,
        }}
        {...props}
      >
        {withTopLine && (
          <div
            className="pointer-events-none absolute left-6 right-6 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, var(--wedding-accent), transparent)`,
            }}
          />
        )}
        {withCorners && (
          <>
            <div className="pointer-events-none absolute left-3 top-3 text-[8px] opacity-20 text-wedding-accent">
              ❧
            </div>
            <div
              className="pointer-events-none absolute right-3 top-3 text-[8px] opacity-20 text-wedding-accent"
              style={{ transform: "scaleX(-1)" }}
            >
              ❧
            </div>
          </>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export { Card }
export default Card
