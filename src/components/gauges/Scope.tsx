'use client'
import { useEffect, useRef } from 'react'
import { rig, step } from '@/lib/rig'

// Live trace on a mini tube: idle sine that swells with scroll energy and
// degauss. Phosphor persistence is a translucent clear each frame; the glow
// is a second, wider stroke (canvas shadowBlur is a software blur and is
// slow in Firefox). Runs at 30 fps.
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
    let even = false
    let w = c.clientWidth
    let h = c.clientHeight
    const size = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = Math.max(1, w * d)
      c.height = Math.max(1, h * d)
    }
    size()
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(size) : null
    ro?.observe(c)
    const tick = (t: number) => {
      if (!alive) return
      step(t)
      even = !even
      if (even) {
        id = requestAnimationFrame(tick)
        return
      }
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.globalAlpha = 0.4
      ctx.fillStyle = '#0d110b'
      ctx.fillRect(0, 0, w, h)
      ctx.globalAlpha = 1
      const amp = 0.18 + rig.energy * 0.8 + rig.degauss * 0.6
      phase += 0.2 + rig.energy * 0.5
      ctx.beginPath()
      for (let x = 0; x <= w; x += 2) {
        const u = x / w
        const y = h / 2 + Math.sin(u * 9 + phase) * h * 0.38 * amp * (1 + 0.3 * Math.sin(u * 23 + phase * 2.3))
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'rgba(216,242,110,0.28)'
      ctx.lineWidth = 3.5
      ctx.stroke()
      ctx.strokeStyle = '#d8f26e'
      ctx.lineWidth = 1.3
      ctx.stroke()
      id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(id)
      ro?.disconnect()
    }
  }, [])
  return (
    <div className="well hidden sm:block">
      SCOPE
      <canvas ref={ref} role="img" aria-label="scope trace" className="scope-canvas" />
    </div>
  )
}
