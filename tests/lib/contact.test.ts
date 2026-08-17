import { validatePing } from '@/lib/contact'

test('valid ping passes', () => {
  expect(validatePing({ from: 'a@b.co', message: 'hello there' })).toEqual({ ok: true })
})
test('bad email fails', () => {
  expect(validatePing({ from: 'nope', message: 'hello there' }).ok).toBe(false)
})
test('empty message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: '  ' }).ok).toBe(false)
})
test('oversized message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: 'x'.repeat(5001) }).ok).toBe(false)
})
