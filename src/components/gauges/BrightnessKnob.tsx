'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_BRIGHTNESS,
  type Brightness,
  applyBrightness,
  nextBrightness,
  resolveBrightness,
} from '@/lib/brightness'
import { playClick } from '@/lib/sound'

// Pointer angle: level 1 at 7 o'clock, level 5 at 5 o'clock.
const ANGLE: Record<Brightness, number> = { 1: -135, 2: -67, 3: 0, 4: 67, 5: 135 }
const LEVELS: Brightness[] = [1, 2, 3, 4, 5]
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

function nearest(deg: number): Brightness {
  let best: Brightness = 3
  let dist = Infinity
  for (const l of LEVELS) {
    const d = Math.abs(ANGLE[l] - deg)
    if (d < dist) {
      dist = d
      best = l
    }
  }
  return best
}

/** Knurled knob: drag to a detent, click to step, arrow keys to nudge. */
export function BrightnessKnob() {
  const [level, setLevel] = useState<Brightness>(DEFAULT_BRIGHTNESS)
  const [drag, setDrag] = useState<number | null>(null)
  const knob = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLevel(resolveBrightness(document.documentElement.dataset.brightness))
  }, [])

  const commit = useCallback((next: Brightness) => {
    setLevel(next)
    applyBrightness(next)
    playClick()
  }, [])

  useEffect(() => {
    const el = knob.current
    if (!el) return
    let dragging = false
    let moved = false
    let angle = 0
    const angleOf = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      return (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI
    }
    const down = (e: PointerEvent) => {
      dragging = true
      moved = false
      el.setPointerCapture?.(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      moved = true
      angle = clamp(angleOf(e), -140, 140)
      setDrag(angle)
    }
    const up = () => {
      if (!dragging) return
      dragging = false
      setDrag(null)
      if (moved) commit(nearest(angle))
      else commit(nextBrightness(resolveBrightness(document.documentElement.dataset.brightness)))
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [commit])

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      commit(Math.min(5, level + 1) as Brightness)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      commit(Math.max(1, level - 1) as Brightness)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      commit(nextBrightness(level))
    }
  }

  const a = drag ?? ANGLE[level]
  return (
    <div className="well hidden sm:block" role="group" aria-label="brightness control">
      <div className="flex items-baseline justify-between">
        <span>BRIGHTNESS</span>
        <span className="well-val">{level}/5</span>
      </div>
      <div className="relative mt-0.5 flex flex-col items-center">
        <svg viewBox="0 0 72 72" className="dial-ticks block h-[72px] w-[72px]" aria-hidden="true">
          {LEVELS.map((l) => {
            const rad = (ANGLE[l] * Math.PI) / 180
            return (
              <line
                key={l}
                className={l <= level ? 'on' : undefined}
                x1={36 + Math.sin(rad) * 29}
                y1={36 - Math.cos(rad) * 29}
                x2={36 + Math.sin(rad) * 33}
                y2={36 - Math.cos(rad) * 33}
              />
            )
          })}
          <text x="4" y="70">LO</text>
          <text x="58" y="70">HI</text>
        </svg>
        <span
          ref={knob}
          role="slider"
          tabIndex={0}
          aria-label="brightness"
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={level}
          aria-valuetext={`level ${level} of 5`}
          data-dragging={drag !== null ? '' : undefined}
          className="knob"
          style={{ transform: `rotate(${a}deg)` }}
          onKeyDown={onKey}
        />
      </div>
    </div>
  )
}
