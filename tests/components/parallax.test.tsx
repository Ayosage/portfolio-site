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
  document.documentElement.style.removeProperty('--px')
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
const mount = () =>
  render(
    <>
      <PointerParallax />
      <span data-px className="rig-sheen" />
    </>,
  )

test('pointer lighting writes --px on its consumer only, never on <html>', () => {
  mount()
  const sheen = document.querySelector<HTMLElement>('.rig-sheen')!
  fireEvent.pointerMove(window, { clientX: window.innerWidth, clientY: 10 })
  flush(0)
  expect(Number(sheen.style.getPropertyValue('--px'))).toBeGreaterThan(0)
  expect(document.documentElement.style.getPropertyValue('--px')).toBe('')
})

test('rig.px eases every frame but the DOM is written at most 20 times a second', () => {
  mount()
  const sheen = document.querySelector<HTMLElement>('.rig-sheen')!
  fireEvent.pointerMove(window, { clientX: window.innerWidth, clientY: 10 })
  flush(0)
  const first = sheen.style.getPropertyValue('--px')
  const pxAfterFirst = rig.px
  flush(8.33)
  flush(16.67)
  flush(25)
  expect(rig.px).toBeGreaterThan(pxAfterFirst)
  expect(sheen.style.getPropertyValue('--px')).toBe(first)
  flush(50)
  expect(sheen.style.getPropertyValue('--px')).not.toBe(first)
})

test('the settle loop stops on its own once the value lands', () => {
  mount()
  fireEvent.pointerMove(window, { clientX: window.innerWidth, clientY: 10 })
  let t = 0
  for (let i = 0; i < 400 && queue.length; i++) flush((t += 16.67))
  expect(queue.length).toBe(0)
  expect(rig.px).toBeCloseTo(1, 2)
  expect(t).toBeLessThan(2000)
})
