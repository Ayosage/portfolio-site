import { createTtlCache } from '@/lib/ttl-cache'

const t0 = 1_700_000_000_000

test('returns a value inside the ttl and forgets it after', () => {
  const c = createTtlCache<string>({ ttlMs: 1000, max: 10 })
  c.set('k', 'v', t0)
  expect(c.get('k', t0 + 999)).toBe('v')
  expect(c.get('k', t0 + 1000)).toBeUndefined()
})

test('a miss is undefined, not an error', () => {
  const c = createTtlCache<string>({ ttlMs: 1000, max: 10 })
  expect(c.get('nothing', t0)).toBeUndefined()
})

test('keys do not share an entry', () => {
  const c = createTtlCache<string>({ ttlMs: 1000, max: 10 })
  c.set('a', 'one', t0)
  c.set('b', 'two', t0)
  expect(c.get('a', t0)).toBe('one')
  expect(c.get('b', t0)).toBe('two')
})

test('a refreshed key restarts its ttl', () => {
  const c = createTtlCache<string>({ ttlMs: 1000, max: 10 })
  c.set('k', 'old', t0)
  c.set('k', 'new', t0 + 900)
  expect(c.get('k', t0 + 1800)).toBe('new')
})

test('past the cap the oldest write is evicted, the newest kept', () => {
  const c = createTtlCache<number>({ ttlMs: 10_000, max: 2 })
  c.set('a', 1, t0)
  c.set('b', 2, t0 + 1)
  c.set('c', 3, t0 + 2)
  expect(c.get('a', t0 + 3)).toBeUndefined()
  expect(c.get('b', t0 + 3)).toBe(2)
  expect(c.get('c', t0 + 3)).toBe(3)
})
