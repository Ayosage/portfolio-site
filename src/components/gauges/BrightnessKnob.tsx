'use client'
import { useEffect, useState } from 'react'
import {
  DEFAULT_BRIGHTNESS,
  type Brightness,
  applyBrightness,
  nextBrightness,
  resolveBrightness,
} from '@/lib/brightness'

// Pointer angle: level 1 at 7 o'clock, level 5 at 5 o'clock.
const ANGLE: Record<Brightness, number> = { 1: -135, 2: -67, 3: 0, 4: 67, 5: 135 }

export function BrightnessKnob() {
  const [level, setLevel] = useState<Brightness>(DEFAULT_BRIGHTNESS)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLevel(resolveBrightness(document.documentElement.dataset.brightness))
  }, [])
  function turn() {
    const next = nextBrightness(level)
    setLevel(next)
    applyBrightness(next)
  }
  return (
    <button
      onClick={turn}
      className="hidden border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-left text-[10px] text-[var(--chrome-dim)] sm:block"
    >
      BRIGHTNESS
      <span className="sr-only"> level {level} of 5, turn to change</span>
      <span aria-hidden="true" className="mt-1.5 flex flex-col items-center gap-1">
        <span className="knob" style={{ transform: `rotate(${ANGLE[level]}deg)` }} />
        <span className="flex w-full justify-between text-[8px] tracking-[0.1em]">
          <span>LO</span>
          <span>HI</span>
        </span>
      </span>
    </button>
  )
}
