export type TimeLeft = { d: number; h: number; m: number; s: number } | null

export function getTimeLeft(targetDate: string): TimeLeft | null {
  const target = new Date(targetDate).getTime()
  if (Number.isNaN(target)) return null

  const diff = target - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 }

  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  }
}
