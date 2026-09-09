'use client'
import { BUILD_HASH } from '@/lib/build-info'
import { HardwareSwitch } from './HardwareSwitch'
import { setSoundEnabled } from '@/lib/sound'
import { setKeysEnabled } from '@/lib/keys'
import { rig } from '@/lib/rig'

export function TopBezel() {
  return (
    <header className="relative z-10 flex items-center justify-between px-2 py-1.5 text-[10px] tracking-[0.15em] text-[var(--chrome-dim)] sm:px-1.5 sm:pb-2.5 sm:pt-1">
      <span className="bezel-model">
        <b>BS-01</b> <span className="hidden sm:inline">▪ FIELD TERMINAL </span>▪{' '}
        <span>SN {BUILD_HASH}</span>
      </span>
      <span className="flex items-center gap-3.5">
        <HardwareSwitch
          id="scanlines"
          label="SCANLINES"
          shortLabel="SCAN"
          storageKey="bs01-scanlines"
          onFlip={(on) => {
            document.documentElement.dataset.scanlines = on ? 'on' : 'off'
            rig.scan = on
          }}
        />
        <HardwareSwitch
          id="sound"
          label="SOUND"
          shortLabel="SND"
          storageKey="bs01-sound"
          onFlip={setSoundEnabled}
          defaultOn={false}
        />
        <HardwareSwitch id="keys" label="KEYS" storageKey="bs01-keys" onFlip={setKeysEnabled} />
        <span aria-hidden="true" className="lens" />
      </span>
    </header>
  )
}
