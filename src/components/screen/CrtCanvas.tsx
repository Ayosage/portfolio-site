'use client'
import { useEffect, useRef } from 'react'
import { createGL, type Gl } from '@/lib/crt'
import { rig, reducedMotion, step } from '@/lib/rig'
import { resolveBrightness } from '@/lib/brightness'

// The tube, mounted after hydration on an idle slot so it never touches LCP.
// The CSS --screen ground underneath is the poster. rAF stops on its own when
// the tab is hidden.
export function CrtCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas || typeof requestAnimationFrame !== 'function') return
    let gl: Gl | null = null
    let alive = true
    let id = 0
    const host = canvas.parentElement
    const motion = reducedMotion() ? 0 : 1
    rig.bright = resolveBrightness(document.documentElement.dataset.brightness)
    rig.scan = document.documentElement.dataset.scanlines !== 'off'
    const frame = (t: number) => {
      if (!alive || !gl) return
      step(t)
      gl.resize()
      gl.set('u_time', t / 1000)
      gl.set('u_boot', rig.boot)
      gl.set('u_glitch', rig.glitch)
      gl.set('u_flash', rig.flash * rig.flash)
      gl.set('u_degauss', rig.degauss * rig.degauss)
      gl.set('u_scan', rig.scan ? 1 : 0)
      gl.set('u_bright', [0, 0.55, 0.78, 1, 1.18, 1.35][rig.bright] ?? 1)
      gl.set('u_motion', motion)
      gl.draw()
      if (host) {
        host.style.setProperty('--gl', rig.glitch.toFixed(3))
        host.style.setProperty('--on', Math.min(1, rig.boot * 1.4).toFixed(3))
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
    const idle = typeof window.requestIdleCallback === 'function'
    const handle = idle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 300)
    return () => {
      alive = false
      cancelAnimationFrame(id)
      if (idle) window.cancelIdleCallback(handle)
      else clearTimeout(handle)
      gl?.lose()
    }
  }, [])
  return <canvas ref={ref} className="crt-gl" aria-hidden="true" />
}
