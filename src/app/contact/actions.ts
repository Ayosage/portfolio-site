'use server'
import { validatePing } from '@/lib/contact'

export type PingState = { status: 'idle' | 'sent' | 'error'; error?: string }

export async function sendPing(_prev: PingState, formData: FormData): Promise<PingState> {
  const input = {
    from: String(formData.get('from') ?? ''),
    message: String(formData.get('message') ?? ''),
  }
  const result = validatePing(input)
  if (!result.ok) return { status: 'error', error: result.error }
  console.log('[BS-01 PING]', JSON.stringify(input))
  return { status: 'sent' }
}
