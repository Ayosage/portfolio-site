'use client'
import { useEffect } from 'react'
import { rig } from '@/lib/rig'

// Pointer → lighting. rig.px eases toward the pointer every frame and the
// tube shader reads it for the glass reflection; nothing in the DOM moves.
// The loop runs only while the value is still settling; idle costs nothing.
export function PointerParallax() {
  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') return
    let id = 0
    let running = false
    let lastT = -1
    const tick = (t: number) => {
      const dt = lastT < 0 ? 1000 / 60 : Math.min(64, Math.max(0, t - lastT))
      lastT = t
      // Half-life 90 ms: lands within ~1 s of the last move.
      rig.px += (rig.tpx - rig.px) * (1 - Math.pow(0.5, dt / 90))
      const settled = Math.abs(rig.tpx - rig.px) <= 0.002
      if (settled) rig.px = rig.tpx
      if (!settled) id = requestAnimationFrame(tick)
      else running = false
    }
    const onMove = (e: PointerEvent) => {
      rig.tpx = (e.clientX / window.innerWidth) * 2 - 1
      if (!running) {
        running = true
        lastT = -1
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
