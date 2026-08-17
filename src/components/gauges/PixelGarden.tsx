'use client'
import { useEffect, useState } from 'react'
import { MAX_STAGE, readSections, stageFor } from '@/lib/garden'

export function PixelGarden() {
  const [stage, setStage] = useState(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStage(stageFor(readSections().size))
    const onGrow = (e: Event) => setStage((e as CustomEvent<number>).detail)
    window.addEventListener('bs01-garden', onGrow)
    return () => window.removeEventListener('bs01-garden', onGrow)
  }, [])
  return (
    <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--chrome-dim)]">
      GARDEN
      <svg viewBox="0 0 40 30" className="mt-1 h-9 w-auto" aria-hidden="true">
        {stage >= 1 && <path d="M20 30 L20 22" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 2 && <path d="M20 30 L20 14" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 3 && <path d="M20 24 C17 20 14 18 10 16" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 4 && <path d="M20 20 C24 16 27 14 30 12" stroke="var(--phosphor-dim)" strokeWidth="1.5" fill="none" />}
        {stage >= 5 && <circle cx="10" cy="15" r="2" fill="var(--phosphor)" />}
        {stage >= 6 && <circle cx="30" cy="11" r="2" fill="var(--phosphor)" />}
        {stage >= 7 && <circle cx="20" cy="11" r="3" fill="var(--phosphor)" />}
      </svg>
      <span aria-label={`garden stage ${stage} of ${MAX_STAGE}`}>
        STAGE {stage}/{MAX_STAGE}
        {stage === MAX_STAGE && ' ✺ IN BLOOM'}
      </span>
    </div>
  )
}
