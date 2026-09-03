import { createLimiter } from '@/lib/ratelimit'

const t0 = 1_700_000_000_000
const make = () =>
  createLimiter({ perKey: { max: 3, windowMs: 600_000 }, global: { max: 5, windowMs: 3_600_000 } })

test('allows up to the per-key max inside the window, then refuses', () => {
  const lim = make()
  expect(lim.allow('1.1.1.1', t0)).toBe(true)
  expect(lim.allow('1.1.1.1', t0 + 1)).toBe(true)
  expect(lim.allow('1.1.1.1', t0 + 2)).toBe(true)
  expect(lim.allow('1.1.1.1', t0 + 3)).toBe(false)
})
test('per-key window slides: old hits expire', () => {
  const lim = make()
  for (let i = 0; i < 3; i++) lim.allow('k', t0 + i)
  expect(lim.allow('k', t0 + 600_001)).toBe(true)
})
test('different keys do not share a bucket', () => {
  const lim = make()
  for (let i = 0; i < 3; i++) lim.allow('a', t0)
  expect(lim.allow('b', t0)).toBe(true)
})
test('global cap refuses everyone once the site-wide budget is spent', () => {
  const lim = make()
  expect(lim.allow('a', t0)).toBe(true)
  expect(lim.allow('b', t0)).toBe(true)
  expect(lim.allow('c', t0)).toBe(true)
  expect(lim.allow('d', t0)).toBe(true)
  expect(lim.allow('e', t0)).toBe(true)
  expect(lim.allow('f', t0)).toBe(false)
})
test('refused attempts do not consume budget', () => {
  const lim = make()
  for (let i = 0; i < 6; i++) lim.allow('a', t0) // 3 allowed, 3 refused
  expect(lim.allow('b', t0)).toBe(true)
  expect(lim.allow('c', t0)).toBe(true)
})
