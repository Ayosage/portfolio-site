'use client'
import { useEffect, useState } from 'react'

export function BootOverlay() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let booted = false
    try {
      booted = sessionStorage.getItem('bs01-booted') === '1'
    } catch {}
    if (reduced || booted) return
    try {
      sessionStorage.setItem('bs01-booted', '1')
    } catch {}
    setVisible(true)
    const dismiss = () => setVisible(false)
    const timer = setTimeout(dismiss, 1200)
    window.addEventListener('keydown', dismiss)
    window.addEventListener('pointerdown', dismiss)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('pointerdown', dismiss)
    }
  }, [])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-10 bg-[var(--screen)] p-4 text-[11px] leading-relaxed text-[var(--phosphor-dim)]"
    >
      <p>BS-01 BIOS v2.6</p>
      <p>MEM CHECK ......... OK</p>
      <p>SOLAR CELL ........ OK</p>
      <p className="text-[var(--phosphor)]">LOADING PORTFOLIO.SYS ▮▮▮▮▯</p>
    </div>
  )
}
