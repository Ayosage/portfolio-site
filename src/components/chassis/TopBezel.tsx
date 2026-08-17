'use client'
import { BUILD_HASH } from '@/lib/build-info'
import { HardwareSwitch } from './HardwareSwitch'
import { setSoundEnabled } from '@/lib/sound'

export function TopBezel() {
  return (
    <header className="flex items-center justify-between px-3 py-2 text-[9px] tracking-[0.15em] text-[var(--phosphor-dim)]">
      <span>
        BS-01 ▪ FIELD TERMINAL ▪ <span aria-label="serial number">SN {BUILD_HASH}</span>
      </span>
      <span className="flex items-center gap-3">
        <HardwareSwitch
          id="scanlines"
          label="SCANLINES"
          storageKey="bs01-scanlines"
          onFlip={(on) =>
            (document.documentElement.dataset.scanlines = on ? 'on' : 'off')
          }
        />
        <HardwareSwitch
          id="sound"
          label="SOUND"
          storageKey="bs01-sound"
          onFlip={setSoundEnabled}
          defaultOn={false}
        />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--phosphor)] shadow-[0_0_6px_var(--glow)]" />
      </span>
    </header>
  )
}
