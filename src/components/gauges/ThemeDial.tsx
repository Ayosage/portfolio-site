'use client'
import { useEffect, useState } from 'react'
import { THEMES, type Theme, applyTheme } from '@/lib/theme'

const LABEL: Record<Theme, string> = { green: 'GRN', amber: 'AMB', paper: 'PPR' }

export function ThemeDial() {
  const [theme, setTheme] = useState<Theme>('green')
  useEffect(() => {
    const t = document.documentElement.dataset.theme as Theme | undefined
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (t && THEMES.includes(t)) setTheme(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function cycle() {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    applyTheme(next)
  }
  return (
    <button
      onClick={cycle}
      className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-left text-[8px] text-[var(--phosphor-dim)]"
    >
      THEME DIAL
      <span aria-hidden="true" className="block text-center text-sm text-[var(--phosphor)]">◉</span>
      <span className="flex justify-between text-[7px]">
        {THEMES.map((t) => (
          <span
            key={t}
            aria-current={t === theme ? 'true' : undefined}
            style={{ color: t === theme ? 'var(--phosphor)' : undefined }}
          >
            {LABEL[t]}
          </span>
        ))}
      </span>
    </button>
  )
}
