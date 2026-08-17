export const BUILD_HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev'
export const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now())

export function uptimeDays(buildTime: number, now: number): number {
  return Math.max(0, Math.floor((now - buildTime) / 86_400_000))
}
