let enabled = false
let sharedCtx: AudioContext | undefined
export function setSoundEnabled(on: boolean): void {
  enabled = on
}
export function soundEnabled(): boolean {
  return enabled
}
function getContext(): AudioContext | undefined {
  if (typeof AudioContext === 'undefined') return undefined
  if (!sharedCtx) sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') void sharedCtx.resume()
  return sharedCtx
}
export function playClick(): void {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 2200
  gain.gain.setValueAtTime(0.04, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}
