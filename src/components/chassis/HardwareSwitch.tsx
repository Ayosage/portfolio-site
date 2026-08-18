'use client'
import { useEffect, useState } from 'react'

export function HardwareSwitch(props: {
  id: string
  label: string
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
  }
  return (
    <button
      role="switch"
      data-switch={props.id}
      aria-checked={on}
      aria-label={props.label}
      onClick={flip}
      className="flex items-center gap-1 text-[9px] tracking-widest text-[var(--chrome-dim)]"
    >
      {props.label}
      <span className="inline-block h-3 w-6 rounded-full bg-[var(--chassis-well)] relative">
        <span
          className="absolute top-[2px] h-2 w-2 rounded-full transition-none"
          style={{
            left: on ? 'auto' : '2px',
            right: on ? '2px' : 'auto',
            background: on ? 'var(--phosphor)' : 'var(--phosphor-dim)',
          }}
        />
      </span>
    </button>
  )
}
