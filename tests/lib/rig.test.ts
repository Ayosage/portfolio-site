import { vi } from 'vitest'
import { rig, collapse, raster, kick, step, degaussPulse } from '@/lib/rig'
import { SPIN_UP_MS, RASTER_MS } from '@/lib/motion'

// Fixed-step fallback path: no rAF, 16ms ticks under fake timers.
const originalRaf = window.requestAnimationFrame

beforeEach(() => {
  vi.useFakeTimers()
  // @ts-expect-error force the timeout fallback
  window.requestAnimationFrame = undefined
  rig.boot = 1
  rig.flash = 0
  rig.glitch = 0
  rig.tglitch = 0
  rig.energy = 0
})
afterEach(() => {
  window.requestAnimationFrame = originalRaf
  vi.useRealTimers()
})

test('collapse takes the picture to a line within SPIN_UP_MS and calls back', () => {
  const done = vi.fn()
  collapse(done)
  vi.advanceTimersByTime(SPIN_UP_MS / 2)
  expect(rig.boot).toBeGreaterThan(0)
  expect(rig.boot).toBeLessThan(1)
  vi.advanceTimersByTime(SPIN_UP_MS + 32)
  expect(rig.boot).toBe(0)
  expect(done).toHaveBeenCalledTimes(1)
})

test('raster flashes and brings the picture back; a new tween retargets the old one', () => {
  rig.boot = 0
  collapse()
  raster()
  expect(rig.flash).toBeGreaterThan(0)
  vi.advanceTimersByTime(RASTER_MS + 32)
  expect(rig.boot).toBe(1)
})

test('kick feeds energy and only hard scrolls tear the picture', () => {
  kick(0.2)
  expect(rig.energy).toBeCloseTo(0.2)
  expect(rig.tglitch).toBe(0)
  kick(0.9)
  expect(rig.tglitch).toBeGreaterThan(0)
})

test('step decays every field and is idempotent per frame', () => {
  kick(1)
  degaussPulse()
  rig.flash = 1
  step(100)
  const after = { ...rig }
  step(100)
  expect(rig.energy).toBe(after.energy)
  expect(rig.flash).toBeLessThan(1)
  expect(rig.degauss).toBeLessThan(1)
  for (let t = 200; t < 20000; t += 16) step(t)
  expect(rig.energy).toBeLessThan(0.01)
  expect(rig.glitch).toBeLessThan(0.01)
})
