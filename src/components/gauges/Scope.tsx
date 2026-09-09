'use client'
import { useEffect, useRef } from 'react'
import { rig, step } from '@/lib/rig'

// Live trace on a mini tube: idle sine that swells with scroll energy and
// degauss. Phosphor persistence is a translucent clear each frame.
export function Scope() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c || typeof requestAnimationFrame !== 'function') return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const d = Math.min(window.devicePixelRatio || 1, 2)
    let alive = true
    let id = 0
    let phase = 0
    const tick = (t: number) => {
      if (!alive) return
      step(t)
      const w = c.clientWidth
      const h = c.clientHeight
      if (c.width !== w * d) {
        c.width = w * d
        c.height = h * d
      }
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.globalAlpha = 0.28
      ctx.fillStyle = '#0d110b'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
      ctx.strokeStyle = '#d8f26e'
      ctx.lineWidth = 1.4
      ctx.shadowColor = '#d8f26e'
      ctx.shadowBlur = 4
      const amp = 0.18 + rig.energy * 0.8 + rig.degauss * 0.6
      phase += 0.11 + rig.energy * 0.3
      ctx.beginPath()
      for (let x = 0; x <= w; x += 2) {
        const u = x / w
        const y = h / 2 + Math.sin(u * 9 + phase) * h * 0.38 * amp * (1 + 0.3 * Math.sin(u * 23 + phase * 2.3))
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(id)
    }
  }, [])
  return (
    <div className="well hidden sm:block">
      SCOPE
      <canvas ref={ref} role="img" aria-label="scope trace" className="scope-canvas" />
    </div>
  )
}
