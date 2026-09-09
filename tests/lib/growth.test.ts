import { GROWTH_EVENT, GROWTH_THROTTLE_MS, readGrowth, recordInteraction, resetGrowthThrottle } from '@/lib/growth'

beforeEach(() => {
  localStorage.clear()
  resetGrowthThrottle()
})

test('starts at zero and ignores junk in storage', () => {
  expect(readGrowth()).toBe(0)
  localStorage.setItem('bs01-growth', 'lots')
  expect(readGrowth()).toBe(0)
  localStorage.setItem('bs01-growth', '-4')
  expect(readGrowth()).toBe(0)
})

test('each interaction adds, persists, and broadcasts the total', () => {
  let heard = -1
  window.addEventListener(GROWTH_EVENT, (e) => {
    heard = (e as CustomEvent<number>).detail
  })
  expect(recordInteraction(1, 1000)).toBe(1)
  expect(recordInteraction(2, 2000)).toBe(3)
  expect(localStorage.getItem('bs01-growth')).toBe('3')
  expect(heard).toBe(3)
})

test('bursts inside the throttle window count once', () => {
  recordInteraction(1, 5000)
  expect(recordInteraction(1, 5000 + GROWTH_THROTTLE_MS - 1)).toBe(1)
  expect(recordInteraction(1, 5000 + GROWTH_THROTTLE_MS)).toBe(2)
})
