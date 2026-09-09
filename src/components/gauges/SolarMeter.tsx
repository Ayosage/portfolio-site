'use client'
import { useEffect, useRef, useState } from 'react'
import { solarPercent } from '@/lib/solar'

const TICKS = Array.from({ length: 7 }, (_, i) => (-60 + 20 * i) * (Math.PI / 180))
const arc = (deg: number, r: number) => `${50 + Math.sin((deg * Math.PI) / 180) * r} ${52 - Math.cos((deg * Math.PI) / 180) * r}`

/** Analog meter: a needle on a spring reads the visitor's local sun. */
export function SolarMeter() {
  const [pct, setPct] = useState<number | null>(null)
  const needle = useRef<SVGGElement>(null)
  useEffect(() => {
    const update = () => setPct(solarPercent(new Date()))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (pct === null || typeof requestAnimationFrame !== 'function') return
    let angle = -60
    let vel = 0
    let alive = true
    let id = 0
    const target = -60 + (120 * pct) / 100
    const tick = () => {
      if (!alive) return
      vel += (target - angle) * 0.06 - vel * 0.35
      angle += vel
      needle.current?.setAttribute('transform', `rotate(${angle.toFixed(2)} 50 52)`)
      if (Math.abs(target - angle) > 0.02 || Math.abs(vel) > 0.02) id = requestAnimationFrame(tick)
    }
    id = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(id)
    }
  }, [pct])
  return (
    <div className="well">
      <div className="flex items-baseline justify-between">
        <span>SOLAR</span>
        <span className="well-val">{pct ?? '—'}%</span>
      </div>
      <svg
        viewBox="0 0 100 58"
        role="img"
        aria-label={`solar ${pct ?? 0} percent`}
        className="mt-1 hidden w-full sm:block"
      >
        <path d="M8 56 A42 42 0 0 1 92 56 Z" fill="var(--screen)" opacity=".9" />
        <path d={`M ${arc(-60, 37)} A 37 37 0 0 1 ${arc(60, 37)}`} fill="none" stroke="var(--hairline)" strokeWidth="1" />
        {TICKS.map((a, i) => (
          <line
            key={i}
            x1={50 + Math.sin(a) * 34}
            y1={52 - Math.cos(a) * 34}
            x2={50 + Math.sin(a) * 40}
            y2={52 - Math.cos(a) * 40}
            stroke="var(--chrome-dim)"
            strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
          />
        ))}
        <g ref={needle} transform="rotate(-60 50 52)">
          <line x1="50" y1="52" x2="50" y2="14" stroke="var(--phosphor)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <circle cx="50" cy="52" r="3" fill="var(--chrome-dim)" />
      </svg>
    </div>
  )
}
