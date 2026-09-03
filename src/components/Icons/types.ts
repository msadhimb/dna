import * as React from "react"

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "color" | "width" | "height"> {
  
  size?: number | string
  
  width?: number | string
  
  height?: number | string
  
  color?: string
  className?: string
  style?: React.CSSProperties
}
