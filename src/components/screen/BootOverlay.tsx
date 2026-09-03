'use client'
import { useEffect, useState } from 'react'

export function BootOverlay() {
  const [visible, setVisible] = useState(false)

  // Decide once per session whether to boot. Kept separate from the dismiss
  // effect below so React Strict Mode's mount/cleanup/mount in dev can't
  // strand the overlay: the re-run sees "booted" and leaves `visible` alone.
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
  }, [])

  // Arm the dismiss timer and key/pointer listeners whenever the overlay is
  // showing; re-arms cleanly if the effect is torn down and re-run.
  useEffect(() => {
    if (!visible) return
    const dismiss = () => setVisible(false)
    const timer = setTimeout(dismiss, 1200)
    window.addEventListener('keydown', dismiss)
    window.addEventListener('pointerdown', dismiss)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', dismiss)
      window.removeEventListener('pointerdown', dismiss)
    }
  }, [visible])

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
