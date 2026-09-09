'use client'
import { useEffect, useRef } from 'react'
import { createGL, type Gl } from '@/lib/crt'
import { BUSY_FPS, IDLE_FPS, due, rig, reducedMotion, step } from '@/lib/rig'
import { resolveBrightness } from '@/lib/brightness'

// The tube, mounted after hydration on an idle slot so it never touches LCP.
// The CSS --screen ground underneath is the poster. Renders at 1×, at 30 fps
// while nothing is happening and 60 fps while busy, gated by wall-clock time
// so a 120 Hz display draws no more often than a 60 Hz one. rAF stops on its
// own in hidden tabs.
export function CrtCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || typeof requestAnimationFrame !== 'function') return
    let gl: Gl | null = null
    let alive = true
    let id = 0
    let lastDraw = -Infinity
    let w = canvas.clientWidth
    let h = canvas.clientHeight
    let lastGl = ''
    let lastOn = ''
    const host = canvas.parentElement
    // The tear and the boot fade land as inline styles on the pane itself. A
    // custom property on the screen restyled every node under the glass.
    const pane = host?.querySelector<HTMLElement>('.screen-pane') ?? null
    const motion = reducedMotion() ? 0 : 1
    rig.bright = resolveBrightness(document.documentElement.dataset.brightness)
    rig.scan = document.documentElement.dataset.scanlines !== 'off'

    // A moving pointer is not busy: the reflection band rides the idle cadence.
    const busy = () => rig.boot < 1 || rig.flash > 0.01 || rig.glitch > 0.004 || rig.degauss > 0.004 || rig.energy > 0.05
    const frame = (t: number) => {
      if (!alive || !gl) return
      step(t)
      if (due(t, lastDraw, busy() ? BUSY_FPS : IDLE_FPS)) {
        lastDraw = t
        gl.resize(w, h)
        gl.set('u_time', t / 1000)
        gl.set('u_boot', rig.boot)
        gl.set('u_glitch', rig.glitch)
        gl.set('u_flash', rig.flash * rig.flash)
        gl.set('u_degauss', rig.degauss * rig.degauss)
        gl.set('u_scan', rig.scan ? 1 : 0)
        gl.set('u_bright', [0, 0.55, 0.78, 1, 1.18, 1.35][rig.bright] ?? 1)
        gl.set('u_motion', motion)
        gl.set('u_px', rig.px)
        gl.draw()
      }
      if (pane) {
        // Only touch style when the value actually moved.
        const g = rig.glitch < 0.004 ? '0' : rig.glitch.toFixed(2)
        const on = rig.boot >= 0.999 ? '1' : Math.min(1, rig.boot * 1.4).toFixed(2)
        if (g !== lastGl) {
          pane.style.transform =
            g === '0' ? '' : `translateX(${(Number(g) * 6).toFixed(2)}px) skewX(${(Number(g) * -1.5).toFixed(2)}deg)`
          lastGl = g
        }
        if (on !== lastOn) {
          pane.style.opacity = on === '1' ? '' : on
          lastOn = on
        }
      }
      id = requestAnimationFrame(frame)
    }
    const start = () => {
      if (!alive) return
      gl = createGL(canvas)
      if (!gl) return
      canvas.dataset.live = ''
      id = requestAnimationFrame(frame)
    }
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
      w = canvas.clientWidth
      h = canvas.clientHeight
    }) : null
    ro?.observe(canvas)
    const idle = typeof window.requestIdleCallback === 'function'
    const handle = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300)
    return () => {
      alive = false
      cancelAnimationFrame(id)
      ro?.disconnect()
      if (idle) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
      gl?.lose()
    }
  }, [])
  return <canvas ref={ref} className="crt-gl" aria-hidden="true" />
}
