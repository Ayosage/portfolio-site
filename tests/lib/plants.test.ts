import { makePlant, layoutGarden, visibleSegments, mulberry32, MIN_MARGIN, RIG_MAX_WIDTH } from '@/lib/plants'

test('the same seed always grows the same plant', () => {
  const a = makePlant(7, 100, 800, 500, 0.1)
  const b = makePlant(7, 100, 800, 500, 0.1)
  expect(a).toEqual(b)
  expect(makePlant(8, 100, 800, 500, 0.1)).not.toEqual(a)
})

test('a plant is stems and leaves, ordered from the root upward', () => {
  const segs = makePlant(3, 200, 900, 600, 0)
  expect(segs.length).toBeGreaterThan(10)
  expect(segs.some((s) => s.kind === 'leaf')).toBe(true)
  expect(segs[0].kind).toBe('stem')
  expect(segs[0].d.startsWith('M200.0 900.0')).toBe(true)
})

test('no garden when the rig fills the viewport', () => {
  expect(layoutGarden(RIG_MAX_WIDTH + MIN_MARGIN, 800)).toEqual([])
  expect(layoutGarden(390, 800)).toEqual([])
})

test('wide viewports get plants on both sides, sorted by growth order', () => {
  const segs = layoutGarden(1600, 900)
  expect(segs.length).toBeGreaterThan(100)
  for (let i = 1; i < segs.length; i++) expect(segs[i].order).toBeGreaterThanOrEqual(segs[i - 1].order)
  const xs = segs.map((s) => Number(s.d.slice(1).split(' ')[0]))
  expect(xs.some((x) => x < 260)).toBe(true)
  expect(xs.some((x) => x > 1340)).toBe(true)
})

test('growth reveals a starter sprout, then one segment per three interactions, capped', () => {
  expect(visibleSegments(0, 200)).toBe(4)
  expect(visibleSegments(2, 200)).toBe(4)
  expect(visibleSegments(3, 200)).toBe(5)
  expect(visibleSegments(30, 200)).toBe(14)
  expect(visibleSegments(10_000, 200)).toBe(200)
})

test('mulberry32 is a stable PRNG in [0, 1)', () => {
  const r = mulberry32(42)
  const seq = [r(), r(), r()]
  const r2 = mulberry32(42)
  expect([r2(), r2(), r2()]).toEqual(seq)
  seq.forEach((v) => {
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(1)
  })
})
