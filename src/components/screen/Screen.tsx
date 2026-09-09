'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { BootOverlay } from './BootOverlay'
import { CrtCanvas } from './CrtCanvas'
import { Glass } from './Glass'
import { ScrollReset } from './ScrollReset'
import { degaussPulse, kick, raster, reducedMotion } from '@/lib/rig'
import { playThunk } from '@/lib/sound'

// The CRT frame is fixed to the rig; page content scrolls inside it. The frame
// stays the positioning box so the tube, raster and glass stay pinned.
export function Screen({ children }: { children: React.ReactNode }) {
  const paneRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Every route change re-rasters the picture (the cartridge collapsed it).
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (!reducedMotion()) raster()
  }, [pathname])

  // Scroll velocity → energy for the scope; hard scrolls tear the picture.
  useEffect(() => {
    const pane = paneRef.current
    if (!pane) return
    let lastTop = pane.scrollTop
    let lastAt = performance.now()
    const onScroll = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastAt)
      const v = Math.abs(pane.scrollTop - lastTop) / dt
      lastTop = pane.scrollTop
      lastAt = now
      kick(Math.min(1, v / 2.6))
    }
    pane.addEventListener('scroll', onScroll, { passive: true })
    return () => pane.removeEventListener('scroll', onScroll)
  }, [])

  function onGlass(e: React.MouseEvent<HTMLDivElement>) {
    const t = e.target as HTMLElement
    if (t.closest('a,button,input,textarea,select,label')) return
    degaussPulse()
    playThunk()
  }

  return (
    <div className="crt-frame flex min-h-0">
      <div className="crt-screen flex min-h-0 min-w-0 flex-1 flex-col text-[var(--phosphor)]" onClick={onGlass}>
        <CrtCanvas />
        <div className="crt-veil" aria-hidden="true" />
        <BootOverlay />
        <div
          ref={paneRef}
          role="region"
          aria-label="Screen"
          tabIndex={0}
          data-fixed={pathname === '/' ? '' : undefined}
          className="screen-pane min-h-0 flex-1 overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--phosphor)]"
        >
          {children}
        </div>
        <div className="crt-raster" aria-hidden="true" />
        <Glass />
        <ScrollReset paneRef={paneRef} />
      </div>
    </div>
  )
}
