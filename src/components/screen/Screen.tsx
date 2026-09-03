'use client'
import { useRef } from 'react'
import { BootOverlay } from './BootOverlay'
import { ScreenGarden } from './ScreenGarden'
import { ScrollReset } from './ScrollReset'

// The CRT frame is fixed to the rig; page content scrolls inside it. The frame
// stays the positioning box so scanlines and the garden stay pinned to the glass.
export function Screen({ children }: { children: React.ReactNode }) {
  const paneRef = useRef<HTMLDivElement>(null)
  return (
    <div className="crt-screen flex min-h-0 flex-col text-[var(--phosphor)]">
      <BootOverlay />
      <div
        ref={paneRef}
        role="region"
        aria-label="Screen"
        tabIndex={0}
        className="screen-pane min-h-0 flex-1 overflow-y-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--phosphor)]"
      >
        {children}
      </div>
      <ScrollReset paneRef={paneRef} />
      <ScreenGarden />
    </div>
  )
}
