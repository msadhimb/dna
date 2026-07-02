export const CORNER_POSITIONS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const

export const CORNER_ROT: Record<(typeof CORNER_POSITIONS)[number], string> = {
  "top-left": "0",
  "top-right": "90deg",
  "bottom-right": "180deg",
  "bottom-left": "270deg",
}

export const CORNER_POS: Record<
  (typeof CORNER_POSITIONS)[number],
  React.CSSProperties
> = {
  "top-left": { top: 10, left: 10 },
  "top-right": { top: 10, right: 10 },
  "bottom-right": { bottom: 10, right: 10 },
  "bottom-left": { bottom: 10, left: 10 },
}
