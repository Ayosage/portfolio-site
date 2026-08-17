let enabled = false
export function setSoundEnabled(on: boolean): void {
  enabled = on
}
export function soundEnabled(): boolean {
  return enabled
}
export function playClick(): void {
  if (!enabled || typeof AudioContext === 'undefined') return
  const ctx = new AudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.frequency.value = 2200
  gain.gain.setValueAtTime(0.04, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}
