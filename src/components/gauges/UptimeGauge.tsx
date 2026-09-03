'use client'
import { useEffect, useState } from 'react'
import { BUILD_TIME, uptimeDays } from '@/lib/build-info'

export function UptimeGauge() {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(uptimeDays(BUILD_TIME, Date.now()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[10px] text-[var(--chrome-dim)]">
      UPTIME
      <div className="text-[12px] text-[var(--phosphor)]">{days ?? '—'}d</div>
    </div>
  )
}
