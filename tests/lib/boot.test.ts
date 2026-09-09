import { bootScript } from '@/lib/boot'

function runBoot() {
  new Function(bootScript)()
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.brightness
  delete document.documentElement.dataset.scanlines
})

test('boot stamps stored brightness and scanlines before paint', () => {
  localStorage.setItem('bs01-brightness', '5')
  localStorage.setItem('bs01-scanlines', 'off')
  runBoot()
  expect(document.documentElement.dataset.brightness).toBe('5')
  expect(document.documentElement.dataset.scanlines).toBe('off')
})

test('boot falls back to level 3 and scanlines on when storage is empty or junk', () => {
  localStorage.setItem('bs01-brightness', '42')
  runBoot()
  expect(document.documentElement.dataset.brightness).toBe('3')
  expect(document.documentElement.dataset.scanlines).toBe('on')
})

test('boot no longer stamps a theme; green is the only phosphor', () => {
  localStorage.setItem('bs01-theme', 'amber')
  runBoot()
  expect(document.documentElement.dataset.theme).toBeUndefined()
})
