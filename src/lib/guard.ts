// Bot traps for the PING form. Pure so it can be unit-tested with fixed clocks.
//
// honeypot   — a field people never see; anything in it means a bot filled every input
// renderedAt — Date.now() stamped by the client when the form mounted
// now        — server clock at submit
export type TrapVerdict = 'ok' | 'bot' | 'too-fast'

export const MIN_FILL_MS = 2000

export function checkTrap(input: {
  honeypot: string
  renderedAt: number
  now: number
}): TrapVerdict {
  if (input.honeypot.trim() !== '') return 'bot'
  const elapsed = input.now - input.renderedAt
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return 'too-fast'
  return 'ok'
}
