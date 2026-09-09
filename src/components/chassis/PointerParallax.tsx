'use client'
import { useEffect } from 'react'
import { rig } from '@/lib/rig'

// Pointer → lighting. Writes --px on <html>; the only consumers are the plate
// sheen and the glass reflection, both transform-only layers, so a pointer
// move never repaints anything. The loop runs only while the value is still
// settling, so an idle page costs nothing.
export function PointerParallax() {
  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') return
    const root = document.documentElement
    let id = 0
    let running = false
    const tick = () => {
      rig.px += (rig.tpx - rig.px) * 0.06
      root.style.setProperty('--px', rig.px.toFixed(3))
      if (Math.abs(rig.tpx - rig.px) > 0.002) id = requestAnimationFrame(tick)
      else running = false
    }
    const onMove = (e: PointerEvent) => {
      rig.tpx = (e.clientX / window.innerWidth) * 2 - 1
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
