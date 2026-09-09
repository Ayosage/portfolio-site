'use client'
import { useEffect, useState } from 'react'
import { BUILD_TIME, uptimeDays } from '@/lib/build-info'

const REEL = Array.from({ length: 10 }, (_, k) => k)

/** Mechanical odometer: three reels roll to the days since deploy. */
export function UptimeGauge() {
  const [days, setDays] = useState<number | null>(null)
  const [shown, setShown] = useState(['0', '0', '0'])
  useEffect(() => {
    const d = uptimeDays(BUILD_TIME, Date.now())
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(d)
    const id = setTimeout(() => setShown(String(Math.min(d, 999)).padStart(3, '0').split('')), 250)
    return () => clearTimeout(id)
  }, [])
  return (
    <div className="well">
      UPTIME
      <div className="well-val sm:hidden">{days ?? '—'}d</div>
      <div role="img" aria-label={`${days ?? 0} days`} className="mt-1 hidden gap-0.5 sm:flex">
        {shown.map((d, i) => (
          <span key={i} className="odo-digit">
            <span className="odo-reel" style={{ transform: `translateY(${-18 * Number(d)}px)`, transitionDelay: `${i * 90}ms` }}>
              {REEL.map((k) => (
                <span key={k}>{k}</span>
              ))}
            </span>
          </span>
        ))}
        <span className="ml-0.5 self-center text-[12px] text-[var(--phosphor)]">d</span>
      </div>
    </div>
  )
}
