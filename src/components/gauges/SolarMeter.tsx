'use client'
import { useEffect, useState } from 'react'
import { solarPercent } from '@/lib/solar'

export function SolarMeter() {
  const [pct, setPct] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setPct(solarPercent(new Date()))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])
  const blocks = pct === null ? 0 : Math.round(pct / 20)
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[10px] text-[var(--chrome-dim)]">
      SOLAR
      <div aria-hidden="true" className="text-[12px] text-[var(--phosphor)]">
        {'▮'.repeat(blocks)}
        {'▯'.repeat(5 - blocks)}
      </div>
      <span>{pct ?? '—'}%</span>
    </div>
  )
}
