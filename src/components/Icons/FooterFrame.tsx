import * as React from "react"

interface FooterFrameProps {
  
  color?: string
  
  accent?: string
  isDark?: boolean
  
  size?: number | string
  
  width?: number | string
  className?: string
  style?: React.CSSProperties
}


export function FooterFrame({
  color,
  accent,
  isDark = false,
  size,
  width: widthProp,
  className,
  style,
}: FooterFrameProps) {
  const raw = size ?? widthProp ?? 320
  const widthNum = typeof raw === "number" ? raw : parseInt(raw as string, 10) || 320
  const widthStr = typeof raw === "number" ? `${raw}px` : (raw as string)
  const h = widthNum * 0.55
  const cx = widthNum / 2
  const strokeColor = color ?? accent ?? (isDark ? "#A0A0A0" : "#c9a227")
  const fillColor = isDark ? "#0A0A0A" : "#F8F5EE"

  return (
    <svg
      width={widthNum}
      height={h}
      viewBox={`0 0 ${widthNum} ${h}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`mx-auto block drop-shadow-sm ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    >
      
      <rect
        x={cx - widthNum / 2 + 4}
        y={4}
        width={widthNum - 8}
        height={h - 8}
        rx="8"
        fill={isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.08)"}
      />

      
      <rect
        x={cx - widthNum / 2}
        y="0"
        width={widthNum - 8}
        height={h - 8}
        rx="6"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.5"
      />

      
      <rect
        x={cx - widthNum / 2 + 10}
        y="10"
        width={widthNum - 28}
        height={h - 28}
        rx="4"
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.5"
        strokeOpacity="0.25"
      />

      
      <path
        d={`M ${cx - widthNum / 2 + 10} 28 Q ${cx - widthNum / 2 + 10} 10 ${cx - widthNum / 2 + 28} 10`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle cx={cx - widthNum / 2 + 19} cy="19" r="2" fill={strokeColor} opacity="0.5" />

      
      <path
        d={`M ${cx + widthNum / 2 - 18} 10 Q ${cx + widthNum / 2 - 10} 10 ${cx + widthNum / 2 - 10} 28`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle cx={cx + widthNum / 2 - 19} cy="19" r="2" fill={strokeColor} opacity="0.5" />

      
      <path
        d={`M ${cx - widthNum / 2 + 10} ${h - 19} Q ${cx - widthNum / 2 + 10} ${h - 11} ${cx - widthNum / 2 + 28} ${h - 11}`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle cx={cx - widthNum / 2 + 19} cy={h - 19} r="2" fill={strokeColor} opacity="0.5" />

      
      <path
        d={`M ${cx + widthNum / 2 - 18} ${h - 11} Q ${cx + widthNum / 2 - 10} ${h - 11} ${cx + widthNum / 2 - 10} ${h - 19}`}
        stroke={strokeColor}
        strokeWidth="1"
        strokeOpacity="0.6"
        fill="none"
      />
      <circle cx={cx + widthNum / 2 - 19} cy={h - 19} r="2" fill={strokeColor} opacity="0.5" />

      
      <path
        d={`M ${cx} ${h * 0.18} L ${cx + 8} ${h * 0.24} L ${cx} ${h * 0.3} L ${cx - 8} ${h * 0.24} Z`}
        fill={strokeColor}
        opacity="0.5"
      />
      <path
        d={`M ${cx} ${h * 0.70} L ${cx + 8} ${h * 0.76} L ${cx} ${h * 0.82} L ${cx - 8} ${h * 0.76} Z`}
        fill={strokeColor}
        opacity="0.5"
      />
    </svg>
  )
}

export default FooterFrame
