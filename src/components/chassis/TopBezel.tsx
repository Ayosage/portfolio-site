'use client'
import { BUILD_HASH } from '@/lib/build-info'
import { HardwareSwitch } from './HardwareSwitch'
import { setSoundEnabled } from '@/lib/sound'
import { setKeysEnabled } from '@/lib/keys'

export function TopBezel() {
  return (
    <header className="flex items-center justify-between px-2 py-1.5 text-[9px] tracking-[0.15em] text-[var(--chrome-dim)] sm:px-3 sm:py-2">
      <span>
        BS-01 <span className="hidden sm:inline">▪ FIELD TERMINAL </span>▪{' '}
        <span>SN {BUILD_HASH}</span>
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
        <HardwareSwitch
          id="keys"
          label="KEYS"
          storageKey="bs01-keys"
          onFlip={setKeysEnabled}
        />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--phosphor)] shadow-[0_0_6px_var(--glow)]" />
      </span>
    </header>
  )
}
