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
  }, [])
  function cycle() {
    const next = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length]
    setTheme(next)
    applyTheme(next)
  }
  return (
    <button
      onClick={cycle}
      className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-left text-[10px] text-[var(--chrome-dim)]"
    >
      THEME DIAL
      <span className="mt-1 grid grid-cols-3 text-center text-[9px]">
        {THEMES.map((t) => (
          <span
            key={t}
            aria-current={t === theme ? 'true' : undefined}
            className="flex flex-col items-center gap-0.5"
            style={{ color: t === theme ? 'var(--phosphor)' : undefined }}
          >
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full"
              style={{
                background: t === theme ? 'var(--phosphor)' : 'var(--chassis)',
                boxShadow: t === theme ? '0 0 4px var(--glow)' : undefined,
              }}
            />
            {LABEL[t]}
            {t === theme && <span className="sr-only"> (current)</span>}
          </span>
        ))}
      </span>
    </button>
  )
}
