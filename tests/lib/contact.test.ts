import { validatePing } from '@/lib/contact'

test('valid ping passes', () => {
  expect(validatePing({ from: 'a@b.co', message: 'hello there' })).toEqual({ ok: true })
})
test('bad email fails', () => {
  expect(validatePing({ from: 'nope', message: 'hello there' })).toEqual({
    ok: false,
    error: 'INVALID EMAIL',
  })
})
test('empty message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: '  ' })).toEqual({
    ok: false,
    error: 'MESSAGE IS EMPTY',
  })
})
test('oversized message fails', () => {
  expect(validatePing({ from: 'a@b.co', message: 'x'.repeat(5001) })).toEqual({
    ok: false,
    error: 'MESSAGE TOO LONG',
  })
})
