'use client'
import { useEffect, useState, type CSSProperties } from 'react'
import { playClick } from '@/lib/sound'

/** Bat-handle toggle in a machined collar. Same switch semantics as before. */
export function HardwareSwitch(props: {
  id: string
  label: string
  /** Shorter caption for narrow screens; aria-label always uses `label`. */
  shortLabel?: string
  storageKey: string
  onFlip: (on: boolean) => void
  defaultOn?: boolean
}) {
  const [on, setOn] = useState(props.defaultOn ?? true)
  useEffect(() => {
    const stored = localStorage.getItem(props.storageKey)
    if (stored !== null) {
      const v = stored === 'on'
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOn(v)
      props.onFlip(v)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function flip() {
    const next = !on
    setOn(next)
    try {
      localStorage.setItem(props.storageKey, next ? 'on' : 'off')
    } catch {}
    props.onFlip(next)
    playClick()
  }
  return (
    <button
      role="switch"
      data-switch={props.id}
      aria-checked={on}
      aria-label={props.label}
      onClick={flip}
      className="tog -my-[11px] py-[11px] text-[10px] tracking-widest"
    >
      {props.shortLabel ? (
        <>
          <span aria-hidden="true" className="sm:hidden">{props.shortLabel}</span>
          <span className="hidden sm:inline">{props.label}</span>
        </>
      ) : (
        props.label
      )}
      <span aria-hidden="true" className="tog-collar" style={{ '--on': on ? 1 : 0 } as CSSProperties}>
        <span className="tog-lever" />
      </span>
    </button>
  )
}
