'use server'
import { validatePing } from '@/lib/contact'
import { deliverPing } from '@/lib/mail'

export type PingState = { status: 'idle' | 'sent' | 'error'; error?: string }

export async function sendPing(_prev: PingState, formData: FormData): Promise<PingState> {
  const input = {
    from: String(formData.get('from') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  const result = validatePing(input)
  if (!result.ok) return { status: 'error', error: result.error }

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
