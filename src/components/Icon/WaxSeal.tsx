export function WaxSeal({
  accent,
  isDark,
  size = 72,
}: {
  accent: string
  isDark: boolean
  size?: number
}) {
  const fill = isDark ? "#A0280A" : "#8B6914"
  const glow = isDark ? "rgba(160,40,10,0.4)" : "rgba(139,105,20,0.3)"
  const textColor = isDark ? "#F5DCC8" : "#FFF5E6"
  const viewSize = size
  const cx = viewSize / 2
  const cy = viewSize / 2
  const r1 = viewSize * 0.42
  const r2 = viewSize * 0.49

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute rounded-full blur-xl"
        style={{
          width: `${viewSize + 16}px`,
          height: `${viewSize + 16}px`,
          background: glow,
        }}
      />
      {/* Seal body */}
      <svg
        width={viewSize}
        height={viewSize}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-lg"
      >
        {/* Drip blobs */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const blobAngle = angle + (i % 2 === 0 ? 0.2 : -0.2)
          const bx = cx + (r2 + 4 + (i % 3) * 2) * Math.cos(blobAngle)
          const by = cy + (r2 + 4 + (i % 3) * 2) * Math.sin(blobAngle)
          return (
            <ellipse
              key={i}
              cx={bx}
              cy={by}
              rx={2.5 + (i % 3) * 0.8}
              ry={3 + (i % 2) * 0.8}
              fill={fill}
              opacity={0.7}
            />
          )
        })}
        {/* Main circle */}
        <circle cx={cx} cy={cy} r={r1} fill={fill} />
        {/* Inner ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r1 * 0.8}
          fill="none"
          stroke={isDark ? "rgba(245,220,200,0.15)" : "rgba(255,245,230,0.2)"}
          strokeWidth="1"
        />
        {/* Initials */}
        <text
          x={cx}
          y={cy + viewSize * 0.06}
          textAnchor="middle"
          fontSize={viewSize * 0.18}
          fontWeight="bold"
          fill={textColor}
          fontFamily="var(--font-signature), serif"
        >
          D&amp;A
        </text>
      </svg>
    </div>
  )
}
