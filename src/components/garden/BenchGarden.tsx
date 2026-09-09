'use client'
import { useEffect, useMemo, useState } from 'react'
import { layoutGarden, visibleSegments } from '@/lib/plants'
import { GROWTH_EVENT, readGrowth, recordInteraction } from '@/lib/growth'
import { reducedMotion } from '@/lib/rig'

// Phosphor plants on the bench, behind the rig. Every few interactions a new
// segment draws in; the count persists, so the garden only ever grows.
export function BenchGarden() {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [growth, setGrowth] = useState(0)

  useEffect(() => {
    const measure = () => setDims({ w: window.innerWidth, h: window.innerHeight })
    measure()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGrowth(readGrowth())
    const onGrow = (e: Event) => setGrowth((e as CustomEvent<number>).detail)
    const onPointer = () => recordInteraction(1)
    const onKey = (e: KeyboardEvent) => {
      if (!e.repeat) recordInteraction(1)
    }
    window.addEventListener('resize', measure)
    window.addEventListener(GROWTH_EVENT, onGrow)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener(GROWTH_EVENT, onGrow)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const segs = useMemo(() => (dims ? layoutGarden(dims.w, dims.h) : []), [dims])
  const visible = visibleSegments(growth, segs.length)
  // Segments at or past the previously shown count are new: they draw in.
  // A restored garden (first measure) renders already grown.
  const [prev, setPrev] = useState(visible)
  const [newFrom, setNewFrom] = useState(visible)
  if (visible !== prev) {
    setPrev(visible)
    setNewFrom(prev === 0 ? visible : prev)
  }
  const animate = !reducedMotion()

  return (
    <>
      <span className="sr-only" role="status">
        garden growth {growth}
      </span>
      {dims && segs.length > 0 && (
        <svg className="bench-garden" viewBox={`0 0 ${dims.w} ${dims.h}`} preserveAspectRatio="none" aria-hidden="true">
          {segs.slice(0, visible).map((s, i) => {
            const fresh = animate && i >= newFrom
            return (
              <path
                key={i}
                d={s.d}
                pathLength={1}
                className={`${s.kind}${i >= visible - 3 ? ' tip' : ''}${fresh ? ' draw' : ''}`}
                strokeWidth={s.kind === 'stem' ? s.width : undefined}
                style={fresh ? { animationDelay: `${(i - newFrom) * 120}ms` } : undefined}
              />
            )
          })}
        </svg>
      )}
    </>
  )
}
