import { vi } from 'vitest'
const deliver = vi.fn(async () => ({ ok: true as const }))
vi.mock('@/lib/mail', () => ({ deliverPing: () => deliver() }))
let ip = '203.0.113.9'
vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': ip }),
}))
import { sendPing } from '@/app/contact/actions'

const idle = { status: 'idle' as const }
function form(fields: Record<string, string>) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}
const human = () => ({ from: 'a@b.co', message: 'hello there', website: '', t: String(Date.now() - 5000) })

beforeEach(() => {
  deliver.mockClear()
  vi.stubEnv('RESEND_API_KEY', 'test-key')
})

test('honest submission delivers', async () => {
  const r = await sendPing(idle, form(human()))
  expect(r.status).toBe('sent')
  expect(deliver).toHaveBeenCalledTimes(1)
})

test('filled honeypot pretends to send but delivers nothing', async () => {
  const r = await sendPing(idle, form({ ...human(), website: 'http://spam' }))
  expect(r.status).toBe('sent')
  expect(deliver).not.toHaveBeenCalled()
})

test('submit faster than a person could type is refused with a retry hint', async () => {
  const r = await sendPing(idle, form({ ...human(), t: String(Date.now() - 200) }))
  expect(r).toEqual({ status: 'error', error: 'TOO FAST — TRY AGAIN' })
  expect(deliver).not.toHaveBeenCalled()
})

test('a burst from one address is throttled after three', async () => {
  ip = '203.0.113.10'
  for (let i = 0; i < 3; i++) await sendPing(idle, form(human()))
  const r = await sendPing(idle, form(human()))
  expect(r).toEqual({ status: 'error', error: 'RATE LIMITED — EMAIL DIRECT INSTEAD' })
  expect(deliver).toHaveBeenCalledTimes(3)
})

test('a submission with no render timestamp at all is refused, not trusted', async () => {
  const fd = form(human())
  fd.delete('t')
  const r = await sendPing(idle, fd)
  expect(r).toEqual({ status: 'error', error: 'TOO FAST — TRY AGAIN' })
  expect(deliver).not.toHaveBeenCalled()
})
