import { solarPercent } from '@/lib/solar'

const at = (h: number, m = 0) => new Date(2026, 7, 17, h, m)

test('night is 0', () => {
  expect(solarPercent(at(2))).toBe(0)
  expect(solarPercent(at(23))).toBe(0)
})
test('solar noon (13:00) is 100', () => {
  expect(solarPercent(at(13))).toBe(100)
})
test('sunrise edge is 0, ramps by mid-morning', () => {
  expect(solarPercent(at(6))).toBe(0)
  expect(solarPercent(at(9, 30))).toBeGreaterThan(50)
})
test('always an integer within 0..100', () => {
  for (let h = 0; h < 24; h++) {
    const v = solarPercent(at(h))
    expect(Number.isInteger(v)).toBe(true)
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThanOrEqual(100)
  }
})
