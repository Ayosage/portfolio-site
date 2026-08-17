import { uptimeDays } from '@/lib/build-info'

test('same instant is 0 days', () => {
  expect(uptimeDays(1000, 1000)).toBe(0)
})
test('floors partial days', () => {
  const day = 86_400_000
  expect(uptimeDays(0, 3 * day + day / 2)).toBe(3)
})
test('clock skew never goes negative', () => {
  expect(uptimeDays(2000, 1000)).toBe(0)
})
