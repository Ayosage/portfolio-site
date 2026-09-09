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

// Real displays run at 60, 90 or 120 Hz. The physics and the draw cadence
// must not depend on how often rAF fires.
import { due, IDLE_FPS, BUSY_FPS, SHEEN_FPS } from '@/lib/rig'

test('step decays by elapsed time, not by call count', () => {
  // Two 60 Hz frames and four 120 Hz frames cover the same 33 ms.
  step(0)
  kick(1)
  step(16.67)
  step(33.33)
  const at60 = rig.energy
  rig.energy = 0
  step(1000)
  kick(1)
  step(1008.33)
  step(1016.67)
  step(1025)
  step(1033.33)
  expect(rig.energy).toBeCloseTo(at60, 3)
  expect(at60).toBeCloseTo(0.94 * 0.94, 2)
})

test('due gates draws to a target fps whatever the refresh rate', () => {
  expect(IDLE_FPS).toBe(30)
  expect(BUSY_FPS).toBe(60)
  // The plate sheen is a diffuse 6% band: 20 steps a second read as continuous
  // and every step re-rasterizes the whole plate in Firefox.
  expect(SHEEN_FPS).toBe(20)
  // 120 Hz frames are 8.33 ms apart: a 30 fps loop draws every fourth frame.
  let last = 0
  const drawn: number[] = []
  for (let i = 1; i <= 12; i++) {
    const t = i * 8.333
    if (due(t, last, 30)) {
      drawn.push(i)
      last = t
    }
  }
  expect(drawn).toEqual([4, 8, 12])
  // 60 Hz frames are 16.67 ms apart: a 30 fps loop draws every other frame,
  // a 60 fps loop draws every frame.
  last = 0
  const at60: number[] = []
  for (let i = 1; i <= 4; i++) {
    const t = i * 16.667
    if (due(t, last, 30)) {
      at60.push(i)
      last = t
    }
  }
  expect(at60).toEqual([2, 4])
  expect(due(16.667, 0, 60)).toBe(true)
  expect(due(8.333, 0, 60)).toBe(false)
})
