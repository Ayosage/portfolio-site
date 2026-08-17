export function validatePing(input: {
  from: string
  message: string
}): { ok: true } | { ok: false; error: string } {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.from))
    return { ok: false, error: 'BAD RETURN ADDRESS' }
  const msg = input.message.trim()
  if (msg.length === 0) return { ok: false, error: 'EMPTY TRANSMISSION' }
  if (msg.length > 5000) return { ok: false, error: 'TRANSMISSION TOO LONG' }
  return { ok: true }
}
