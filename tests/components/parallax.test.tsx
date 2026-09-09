import { render, fireEvent } from '@testing-library/react'
import { PointerParallax } from '@/components/chassis/PointerParallax'
import { rig } from '@/lib/rig'

// Manual rAF so the settle loop can be stepped one frame at a time.
let queue: FrameRequestCallback[] = []
const originalRaf = window.requestAnimationFrame
const originalCaf = window.cancelAnimationFrame
beforeEach(() => {
  queue = []
  window.requestAnimationFrame = (cb) => {
    queue.push(cb)
    return queue.length
  }
  window.cancelAnimationFrame = () => {}
  rig.px = 0
  rig.tpx = 0
})
afterEach(() => {
  window.requestAnimationFrame = originalRaf
  window.cancelAnimationFrame = originalCaf
})
const flush = (t: number) => {
  const cbs = queue
  queue = []
  cbs.forEach((cb) => cb(t))
}

test('pointer position eases into rig.px without touching the DOM', () => {
  render(<PointerParallax />)
  fireEvent.pointerMove(window, { clientX: window.innerWidth, clientY: 10 })
  flush(0)
  expect(rig.px).toBeGreaterThan(0)
  expect(rig.px).toBeLessThan(1)
  expect(document.documentElement.style.getPropertyValue('--px')).toBe('')
  expect(document.querySelector('[data-px]')).toBeNull()
})

test('the settle loop stops on its own once the value lands', () => {
  render(<PointerParallax />)
  fireEvent.pointerMove(window, { clientX: window.innerWidth, clientY: 10 })
  let t = 0
  for (let i = 0; i < 400 && queue.length; i++) flush((t += 16.67))
  expect(queue.length).toBe(0)
  expect(rig.px).toBeCloseTo(1, 2)
  expect(t).toBeLessThan(2000)
})
