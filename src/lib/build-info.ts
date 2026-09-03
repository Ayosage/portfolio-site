export const BUILD_HASH = process.env.NEXT_PUBLIC_BUILD_HASH ?? 'dev'
export const BUILD_TIME = Number(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now())

export function uptimeDays(buildTime: number, now: number): number {
  return Math.max(0, Math.floor((now - buildTime) / 86_400_000))
}

/**
 * Serial number shown in the bezel. Local builds read git directly; Vercel's
 * build image has no usable .git, so fall back to the SHA it injects.
 */
export function resolveBuildHash(src: { gitShort: string | null; vercelSha: string | undefined }): string {
  if (src.gitShort) return src.gitShort
  if (src.vercelSha) return src.vercelSha.slice(0, 7)
  return 'dev'
}
