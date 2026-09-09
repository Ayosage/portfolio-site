'use client'
import { useEffect } from 'react'
import { SHEEN_FPS, due, rig } from '@/lib/rig'

// Pointer → lighting. rig.px eases toward the pointer every frame; the tube
// shader reads it directly for the glass reflection. The plate sheen is the
// one DOM consumer ([data-px]) and is written at SHEEN_FPS: the value is a
// custom property scoped to that element, so a write restyles one node, and
// each move re-rasterizes the plate under it in Firefox, so moves are rare.
// The loop runs only while the value is still settling; idle costs nothing.
export function PointerParallax() {
  useEffect(() => {
    if (typeof requestAnimationFrame !== 'function') return
    const consumers = Array.from(document.querySelectorAll<HTMLElement>('[data-px]'))
    let id = 0
    let running = false
    let lastT = -1
    let lastWrite = -Infinity
    const tick = (t: number) => {
      const dt = lastT < 0 ? 1000 / 60 : Math.min(64, Math.max(0, t - lastT))
      lastT = t
      // Half-life 90 ms: lands within ~1 s of the last move.
      rig.px += (rig.tpx - rig.px) * (1 - Math.pow(0.5, dt / 90))
      const settled = Math.abs(rig.tpx - rig.px) <= 0.002
      if (settled) rig.px = rig.tpx
      if (due(t, lastWrite, SHEEN_FPS) || settled) {
        lastWrite = t
        const v = rig.px.toFixed(3)
        for (const el of consumers) el.style.setProperty('--px', v)
      }
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
