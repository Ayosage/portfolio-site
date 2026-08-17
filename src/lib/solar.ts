const SUNRISE = 6
const SUNSET = 20

export function solarPercent(date: Date): number {
  const h = date.getHours() + date.getMinutes() / 60
  if (h <= SUNRISE || h >= SUNSET) return 0
  const t = (h - SUNRISE) / (SUNSET - SUNRISE)
  return Math.round(100 * Math.sin(Math.PI * t))
}
