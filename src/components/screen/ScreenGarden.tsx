'use client'
import { useEffect, useState } from 'react'
import { MAX_STAGE, readSections, stageFor } from '@/lib/garden'

// Decorative overgrowth along the bottom edge of the CRT glass. Grows one
// stage per case-study section read (same 'bs01-garden' events the old
// gauge-well garden used). Non-interactive; clipped by .crt-screen.
export function ScreenGarden() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(stageFor(readSections().size))
    const onGrow = (e: Event) => setStage((e as CustomEvent<number>).detail)
    window.addEventListener('bs01-garden', onGrow)
    return () => window.removeEventListener('bs01-garden', onGrow)
  }, [])
  if (stage === 0) return null
  return (
    <>
      <span className="sr-only" role="status">
        garden stage {stage} of {MAX_STAGE}
        {stage === MAX_STAGE && ' — in bloom'}
      </span>
      <svg
        viewBox="0 0 120 44"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-3 h-11 w-auto opacity-70"
      >
        {stage >= 1 && <path d="M18 44 C18 36 16 32 12 28" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 2 && <path d="M30 44 C30 32 34 26 38 20" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 3 && <path d="M52 44 C52 34 48 30 44 26 M52 44 C52 30 56 24 60 18" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 4 && <path d="M76 44 C76 34 80 28 86 24" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 5 && (
          <>
            <circle cx="12" cy="27" r="2" fill="var(--phosphor)" />
            <circle cx="38" cy="19" r="2" fill="var(--phosphor)" />
          </>
        )}
        {stage >= 6 && (
          <>
            <path d="M98 44 C98 36 102 32 106 30" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />
            <circle cx="86" cy="23" r="2" fill="var(--phosphor)" />
          </>
        )}
        {stage >= 7 && (
          <>
            <circle cx="60" cy="16" r="3" fill="var(--phosphor)" />
            <circle cx="106" cy="29" r="2" fill="var(--phosphor)" />
          </>
        )}
      </svg>
    </>
  )
}
