import { checkTrap } from '@/lib/guard'

const t0 = 1_700_000_000_000

test('empty honeypot and a human-paced submit passes', () => {
  expect(checkTrap({ honeypot: '', renderedAt: t0, now: t0 + 8000 })).toBe('ok')
})
test('filled honeypot is a bot', () => {
  expect(checkTrap({ honeypot: 'http://spam', renderedAt: t0, now: t0 + 8000 })).toBe('bot')
})
test('submit under two seconds after render is too fast', () => {
  expect(checkTrap({ honeypot: '', renderedAt: t0, now: t0 + 900 })).toBe('too-fast')
})
test('missing or garbage render timestamp is too fast (never trust it)', () => {
  expect(checkTrap({ honeypot: '', renderedAt: NaN, now: t0 })).toBe('too-fast')
  expect(checkTrap({ honeypot: '', renderedAt: t0 + 60_000, now: t0 })).toBe('too-fast')
})
