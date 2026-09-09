'use client'
import { useEffect, useRef } from 'react'

// Fingerprints on the glass, drawn once. Sits above the pane and never takes
// clicks. The pointer-driven reflection band is drawn by the tube shader.
export function Glass() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const cv = ref.current
    if (!cv) return
    const draw = () => {
      const ctx = cv.getContext('2d')
      if (!ctx) return
      const d = Math.min(window.devicePixelRatio || 1, 1.5)
      const w = cv.clientWidth
      const h = cv.clientHeight
      cv.width = w * d
      cv.height = h * d
      ctx.setTransform(d, 0, 0, d, 0, 0)
      ctx.clearRect(0, 0, w, h)
      for (const [fx, fy, sc] of [
        [0.82, 0.2, 0.9],
        [0.9, 0.7, 0.7],
        [0.14, 0.8, 0.6],
      ]) {
        ctx.save()
        ctx.translate(fx * w, fy * h)
        ctx.rotate(fx * 3)
        ctx.scale(1, 1.35)
        for (let r = 4; r < 24 * sc; r += 2.6) {
          ctx.beginPath()
          ctx.arc(0, 0, r, 0.2 + r * 0.05, Math.PI * 1.7 + r * 0.03)
          ctx.strokeStyle = `rgba(255,255,255,${0.03 + 0.015 * Math.sin(r)})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
        ctx.restore()
      }
    }
    draw()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(draw)
    ro.observe(cv)
    return () => ro.disconnect()
  }, [])
  return <canvas ref={ref} className="crt-glass" aria-hidden="true" />
}
