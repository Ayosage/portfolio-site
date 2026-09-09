'use client'
import { useEffect, useState } from 'react'
import { raster, reducedMotion } from '@/lib/rig'

const LINES = ['BS-01 BIOS v2.6', 'MEM CHECK ......... OK', 'SOLAR CELL ........ OK', 'CRT DEGAUSS ....... OK']

export function BootOverlay() {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  // Decide once per session whether to boot. Kept separate from the dismiss
  // effect below so React Strict Mode's mount/cleanup/mount in dev can't
  // strand the overlay: the re-run sees "booted" and leaves `visible` alone.
  useEffect(() => {
    let booted = false
    try {
      booted = sessionStorage.getItem('bs01-booted') === '1'
    } catch {}
    if (reducedMotion() || booted) return
    try {
      sessionStorage.setItem('bs01-booted', '1')
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true)
  }, [])

  // Arm the dismiss timer and key/pointer listeners whenever the overlay is
  // showing. The timer starts the 150ms fade; a key/pointer skip unmounts
  // instantly instead. Either way the tube re-rasters underneath.
  useEffect(() => {
    if (!visible) return
    const startFade = () => {
      raster()
      setFading(true)
    }
    const skip = () => {
      raster()
      setFading(false)
      setVisible(false)
    }
    const timer = setTimeout(startFade, 1200)
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [visible])

  useEffect(() => {
    if (!fading) return
    const timer = setTimeout(() => setVisible(false), 150)
    return () => clearTimeout(timer)
  }, [fading])

  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className={`boot-overlay absolute inset-0 z-10 bg-[var(--screen)] p-4 text-[11px] leading-relaxed text-[var(--phosphor-dim)] ${fading ? 'boot-overlay-exit' : ''}`}
    >
      {LINES.map((l) => (
        <p key={l}>{l}</p>
      ))}
      <p className="text-[var(--phosphor)]">LOADING PORTFOLIO.SYS ▮▮▮▮▯</p>
    </div>
  )
}
