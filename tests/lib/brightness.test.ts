import { BRIGHTNESS_LEVELS, DEFAULT_BRIGHTNESS, applyBrightness, resolveBrightness, nextBrightness } from '@/lib/brightness'

test('five levels, default is the middle one', () => {
  expect(BRIGHTNESS_LEVELS).toEqual([1, 2, 3, 4, 5])
  expect(DEFAULT_BRIGHTNESS).toBe(3)
})

test('stored level is honoured; garbage or out-of-range falls back to default', () => {
  expect(resolveBrightness('5')).toBe(5)
  expect(resolveBrightness('1')).toBe(1)
  expect(resolveBrightness('0')).toBe(3)
  expect(resolveBrightness('9')).toBe(3)
  expect(resolveBrightness('bright')).toBe(3)
  expect(resolveBrightness(null)).toBe(3)
})

test('applying a level stamps the html element and persists it', () => {
  localStorage.clear()
  applyBrightness(4)
  expect(document.documentElement.dataset.brightness).toBe('4')
  expect(localStorage.getItem('bs01-brightness')).toBe('4')
})

test('the knob turns up through 5 and wraps to 1', () => {
  expect(nextBrightness(3)).toBe(4)
  expect(nextBrightness(5)).toBe(1)
})
