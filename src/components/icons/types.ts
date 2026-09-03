import * as React from "react"

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "width" | "height"> {
  /** Size controls both width & height for square icons, or width for elongated icons. number = px, string = any CSS unit */
  size?: number | string
  /** Explicit width override (takes precedence over size) */
  width?: number | string
  /** Explicit height override (takes precedence over size) */
  height?: number | string
  /** Main color — mapped to stroke / fill via currentColor where possible */
  color?: string
  className?: string
  style?: React.CSSProperties
}
