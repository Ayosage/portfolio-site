// Tiny TTL cache for outbound API responses. Memory-only, so on serverless it
// is per warm instance: enough to keep a hammering client off the upstream,
// not a guarantee. Capped so a spray of distinct keys cannot grow it forever.
export type TtlCache<T> = {
  get(key: string, now?: number): T | undefined
  set(key: string, value: T, now?: number): void
}

export function createTtlCache<T>(cfg: { ttlMs: number; max: number }): TtlCache<T> {
  const entries = new Map<string, { at: number; value: T }>()
  return {
    get(key, now = Date.now()) {
      const hit = entries.get(key)
      if (!hit) return undefined
      if (now - hit.at >= cfg.ttlMs) {
        entries.delete(key)
        return undefined
      }
      return hit.value
    },
    set(key, value, now = Date.now()) {
      // Re-insert so a refreshed key counts as the newest write: a Map keeps
      // insertion order, which is what the eviction below walks.
      entries.delete(key)
      entries.set(key, { at: now, value })
      while (entries.size > cfg.max) {
        const oldest = entries.keys().next().value
        if (oldest === undefined) break
        entries.delete(oldest)
      }
    },
  }
}
