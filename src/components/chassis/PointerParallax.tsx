'use client'
import { useEffect } from 'react'
import { rig, reducedMotion } from '@/lib/rig'

// Pointer → lighting. Writes --px/--py on <html> (plate sheen, bench light pool,
// glass reflection) and tilts the plate a degree on wide screens. The loop only
// runs while the pointer is still settling, so an idle page costs nothing.
export function PointerParallax() {
  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') return
    const root = document.documentElement
    const plate = document.querySelector<HTMLElement>('[data-rig]')
    const reduced = reducedMotion()
    let id = 0
    let running = false
    const tick = () => {
      rig.px += (rig.tpx - rig.px) * 0.06
      rig.py += (rig.tpy - rig.py) * 0.06
      root.style.setProperty('--px', rig.px.toFixed(3))
      root.style.setProperty('--py', rig.py.toFixed(3))
      if (plate && !reduced && window.innerWidth >= 640) {
        plate.style.transform = `rotateY(${(rig.px * 1.2).toFixed(2)}deg) rotateX(${(-rig.py * 0.9).toFixed(2)}deg)`
      }
      if (Math.abs(rig.tpx - rig.px) + Math.abs(rig.tpy - rig.py) > 0.002) id = requestAnimationFrame(tick)
      else running = false
    }
    const onMove = (e: PointerEvent) => {
      rig.tpx = (e.clientX / window.innerWidth) * 2 - 1
      rig.tpy = (e.clientY / window.innerHeight) * 2 - 1
      if (!running) {
        running = true
        id = requestAnimationFrame(tick)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])
  return null
}
