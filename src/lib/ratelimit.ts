// Sliding-window limiter: a per-key budget (one visitor) and a global budget
// (protects the paid mail quota from a distributed burst). Memory-only, so on
// serverless it is per warm instance — enough to blunt a script, not a
// guarantee. Refused attempts are not recorded, so a hammering client does not
// lock itself out forever, and does not spend the global budget.
export type Window = { max: number; windowMs: number }

export function createLimiter(cfg: { perKey: Window; global: Window }) {
  const perKey = new Map<string, number[]>()
  let global: number[] = []

  const prune = (hits: number[], win: Window, now: number) => {
    const cutoff = now - win.windowMs
    let i = 0
    while (i < hits.length && hits[i] <= cutoff) i++
    return i ? hits.slice(i) : hits
  }

  return {
    allow(key: string, now = Date.now()): boolean {
      global = prune(global, cfg.global, now)
      const mine = prune(perKey.get(key) ?? [], cfg.perKey, now)
      if (global.length >= cfg.global.max || mine.length >= cfg.perKey.max) {
        perKey.set(key, mine)
        return false
      }
      global.push(now)
      mine.push(now)
      perKey.set(key, mine)
      return true
    },
  }
}
