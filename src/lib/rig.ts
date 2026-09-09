import { RASTER_MS, SPIN_UP_MS } from './motion'

// Shared physics/shader state for the rig. Components read it inside their own
// rAF loops; nothing here touches React state, so a scroll kick or a degauss
// never re-renders the tree.
export const rig = {
  /** 0 = raster collapsed to a line, 1 = full picture. */
  boot: 1,
  flash: 0,
  glitch: 0,
  tglitch: 0,
  degauss: 0,
  /** Scroll/interaction energy, decays every frame; drives the scope. */
  energy: 0,
  bright: 3,
  scan: true,
  px: 0,
  py: 0,
  tpx: 0,
  tpy: 0,
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)
export const easeInQuad = (t: number): number => t * t

type TweenKey = 'boot'
const active = new Map<TweenKey, number>()
let token = 0

/**
 * Minimal rAF tween on one numeric field. Retargetable: starting a new tween on
 * the same key cancels the old one. Falls back to 16ms timeouts (fixed step)
 * where rAF is unavailable, which keeps it deterministic under fake timers.
 */
export function tween(
  key: TweenKey,
  to: number,
  ms: number,
  ease: (t: number) => number,
  onDone?: () => void,
): void {
  const id = ++token
  active.set(key, id)
  const from = rig[key]
  const hasRaf = typeof requestAnimationFrame === 'function'
  let elapsed = 0
  let last = hasRaf ? performance.now() : 0
  const frame = (now: number) => {
    if (active.get(key) !== id) return
    elapsed += hasRaf ? now - last : 16
    last = now
    const t = ms <= 0 ? 1 : Math.min(1, elapsed / ms)
    rig[key] = from + (to - from) * ease(t)
    if (t >= 1) {
      active.delete(key)
      onDone?.()
      return
    }
    if (hasRaf) requestAnimationFrame(frame)
    else setTimeout(() => frame(0), 16)
  }
  if (hasRaf) requestAnimationFrame(frame)
  else setTimeout(() => frame(0), 16)
}

/** Picture collapses to a horizontal line, then resolves. */
export function collapse(onDone?: () => void): void {
  tween('boot', 0, SPIN_UP_MS, easeInQuad, onDone)
}

/** Picture expands from the line with a phosphor flash. */
export function raster(): void {
  rig.flash = 0.8
  rig.energy = Math.max(rig.energy, 0.6)
  tween('boot', 1, RASTER_MS, easeOutCubic)
}

/** Scroll energy in 0..1; hard scrolls also tear the picture. */
export function kick(v: number): void {
  const e = Math.min(1, Math.max(0, v))
  rig.energy = Math.max(rig.energy, e)
  if (e > 0.4) rig.tglitch = Math.max(rig.tglitch, e * 0.8)
}

export function degaussPulse(): void {
  rig.degauss = 1
}

let lastFrame = -1
/** Per-frame decay. Idempotent per timestamp so several loops can call it. */
export function step(now: number): void {
  if (now === lastFrame) return
  lastFrame = now
  rig.glitch += (rig.tglitch - rig.glitch) * 0.25
  rig.tglitch = Math.max(0, rig.tglitch - 0.05)
  rig.flash = Math.max(0, rig.flash - 0.05)
  rig.degauss = Math.max(0, rig.degauss - 0.02)
  rig.energy *= 0.94
}

export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
