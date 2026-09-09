// Interaction count that feeds the bench garden. Persisted so it accumulates
// across visits; the garden only ever grows.
export const GROWTH_KEY = 'bs01-growth'
export const GROWTH_EVENT = 'bs01-growth'
/** Ignore bursts (double-clicks, key chords) inside this window. */
export const GROWTH_THROTTLE_MS = 250

export function readGrowth(): number {
  try {
    const n = Number(localStorage.getItem(GROWTH_KEY))
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0
  } catch {
    return 0
  }
}

let lastAt = -Infinity

/** Adds `n` interactions and broadcasts the new total. Returns the total. */
export function recordInteraction(n = 1, now = Date.now()): number {
  const current = readGrowth()
  if (now - lastAt < GROWTH_THROTTLE_MS) return current
  lastAt = now
  const next = current + n
  try {
    localStorage.setItem(GROWTH_KEY, String(next))
  } catch {}
  window.dispatchEvent(new CustomEvent(GROWTH_EVENT, { detail: next }))
  return next
}

/** Test hook: forget the throttle window. */
export function resetGrowthThrottle(): void {
  lastAt = -Infinity
}
