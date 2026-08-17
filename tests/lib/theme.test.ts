import { resolveTheme, applyTheme, THEMES } from '@/lib/theme'

test('stored valid theme wins', () => {
  expect(resolveTheme('amber', true)).toBe('amber')
})
test('no stored + prefers light → paper', () => {
  expect(resolveTheme(null, true)).toBe('paper')
})
test('no stored + prefers dark → green', () => {
  expect(resolveTheme(null, false)).toBe('green')
})
test('garbage stored value falls back to system', () => {
  expect(resolveTheme('neon', false)).toBe('green')
})
test('applyTheme sets dataset and persists', () => {
  applyTheme('amber')
  expect(document.documentElement.dataset.theme).toBe('amber')
  expect(localStorage.getItem('bs01-theme')).toBe('amber')
})
test('three themes exist', () => {
  expect(THEMES).toEqual(['green', 'amber', 'paper'])
})
