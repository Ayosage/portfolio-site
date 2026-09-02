import { vi } from 'vitest'
import { deliverPing } from '@/lib/mail'

const ping = { from: 'fan@example.com', message: 'hello there' }

test('delivers through the Resend API with the key, recipient and reply-to', async () => {
  const fetchFn = vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => '' })
  const result = await deliverPing(ping, { apiKey: 're_test', to: 'me@site.dev', fetchFn })
  expect(result).toEqual({ ok: true })
  expect(fetchFn).toHaveBeenCalledTimes(1)
  const [url, init] = fetchFn.mock.calls[0]
  expect(url).toBe('https://api.resend.com/emails')
  expect(init.method).toBe('POST')
  expect(init.headers.Authorization).toBe('Bearer re_test')
  const body = JSON.parse(init.body)
  expect(body.to).toEqual(['me@site.dev'])
  expect(body.reply_to).toBe('fan@example.com')
  expect(body.text).toContain('hello there')
})

test('reports a failed send instead of pretending it went through', async () => {
  const fetchFn = vi.fn().mockResolvedValue({ ok: false, status: 422, text: async () => 'bad' })
  const result = await deliverPing(ping, { apiKey: 're_test', to: 'me@site.dev', fetchFn })
  expect(result).toEqual({ ok: false, error: 'MAIL REJECTED (422)' })
})

test('without an API key the ping is not delivered', async () => {
  const fetchFn = vi.fn()
  const result = await deliverPing(ping, { apiKey: undefined, to: 'me@site.dev', fetchFn })
  expect(result).toEqual({ ok: false, error: 'MAIL NOT CONFIGURED' })
  expect(fetchFn).not.toHaveBeenCalled()
})
