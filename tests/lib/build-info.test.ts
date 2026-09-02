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

import { resolveBuildHash } from '@/lib/build-info'

test('build hash prefers the local git short hash', () => {
  expect(resolveBuildHash({ gitShort: '8e13769', vercelSha: 'abcdef1234567890' })).toBe('8e13769')
})
test('build hash falls back to the first 7 chars of the Vercel commit SHA', () => {
  expect(resolveBuildHash({ gitShort: null, vercelSha: 'abcdef1234567890' })).toBe('abcdef1')
})
test('build hash is dev when neither source is available', () => {
  expect(resolveBuildHash({ gitShort: null, vercelSha: undefined })).toBe('dev')
})
