import { bootScript } from '@/lib/boot'

function runBoot() {
  new Function(bootScript)()
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.brightness
})

test('boot stamps stored theme and brightness before paint', () => {
  localStorage.setItem('bs01-theme', 'amber')
  localStorage.setItem('bs01-brightness', '5')
  runBoot()
  expect(document.documentElement.dataset.theme).toBe('amber')
  expect(document.documentElement.dataset.brightness).toBe('5')
})

test('boot falls back to green and level 3 when storage is empty or junk', () => {
  localStorage.setItem('bs01-theme', 'neon')
  localStorage.setItem('bs01-brightness', '42')
  runBoot()
  expect(document.documentElement.dataset.theme).toBe('green')
  expect(document.documentElement.dataset.brightness).toBe('3')
})
