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

/** Draw rate while nothing is happening on screen. */
export const IDLE_FPS = 30
/** Draw rate while the picture is booting, tearing, flashing or scrolling. */
export const BUSY_FPS = 60
/**
 * Update rate for the plate sheen. Every step moves a plate-sized band, which
 * Firefox answers by re-rasterizing every tile under it; a diffuse 6% band
 * stepped 20 times a second still reads as a sweep.
 */
export const SHEEN_FPS = 20

/**
 * True when at least one period at `fps` has elapsed since `last`. rAF fires
 * at the display's refresh rate (60, 90, 120 Hz); every loop gates its work
 * through this so a 120 Hz display does not double the cost. The 1 ms slack
 * lets 8.33 ms frames land exactly on 60 and 30 fps periods.
 */
export function due(now: number, last: number, fps: number): boolean {
  return now - last >= 1000 / fps - 1
}

const REF_FRAME_MS = 1000 / 60
let lastFrame = -1
/**
 * Decay by elapsed time. Rates are expressed per 60 Hz frame and scaled by
 * the real delta, so 120 Hz displays decay at the same speed. Idempotent per
 * timestamp so several loops can call it in the same frame.
 */
export function step(now: number): void {
  if (now === lastFrame) return
  const k = lastFrame < 0 ? 1 : Math.min(4, Math.max(0, now - lastFrame) / REF_FRAME_MS)
  lastFrame = now
  rig.glitch += (rig.tglitch - rig.glitch) * (1 - Math.pow(0.75, k))
  rig.tglitch = Math.max(0, rig.tglitch - 0.05 * k)
  rig.flash = Math.max(0, rig.flash - 0.05 * k)
  rig.degauss = Math.max(0, rig.degauss - 0.02 * k)
  rig.energy *= Math.pow(0.94, k)
}

export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
