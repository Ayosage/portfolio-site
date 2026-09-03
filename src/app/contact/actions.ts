'use server'
import { headers } from 'next/headers'
import { validatePing } from '@/lib/contact'
import { deliverPing } from '@/lib/mail'
import { checkTrap } from '@/lib/guard'
import { createLimiter } from '@/lib/ratelimit'

export type PingState = { status: 'idle' | 'sent' | 'error'; error?: string }

// Per visitor: 3 pings per 10 minutes. Site-wide: 30 per hour, so a burst can
// never spend more than a fraction of the mail provider's daily allowance.
const limiter = createLimiter({
  perKey: { max: 3, windowMs: 10 * 60_000 },
  global: { max: 30, windowMs: 60 * 60_000 },
})

async function clientKey(): Promise<string> {
  const h = await headers()
  const fwd = h.get('x-forwarded-for')
  return fwd?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
}

export async function sendPing(_prev: PingState, formData: FormData): Promise<PingState> {
  const input = {
    from: String(formData.get('from') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  const result = validatePing(input)
  if (!result.ok) return { status: 'error', error: result.error }

  const verdict = checkTrap({
    honeypot: String(formData.get('website') ?? ''),
    renderedAt: Number(formData.get('t')),
    now: Date.now(),
  })
  // Bots get a convincing success and nothing is sent.
  if (verdict === 'bot') return { status: 'sent' }
  if (verdict === 'too-fast') return { status: 'error', error: 'TOO FAST — TRY AGAIN' }

  if (!limiter.allow(await clientKey())) {
    return { status: 'error', error: 'RATE LIMITED — EMAIL DIRECT INSTEAD' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey && process.env.NODE_ENV !== 'production') {
    // Local dev without a key: log instead of failing so the form stays usable.
    console.log('[BS-01 PING]', JSON.stringify(input))
    return { status: 'sent' }
  }

  const sent = await deliverPing(input, {
    apiKey,
    to: process.env.CONTACT_TO ?? 'aexbrandon@gmail.com',
    from: process.env.CONTACT_FROM,
  })
  if (!sent.ok) {
    console.error('[BS-01 PING] delivery failed:', sent.error)
    return { status: 'error', error: `${sent.error} — EMAIL DIRECT INSTEAD` }
  }
  return { status: 'sent' }
}
