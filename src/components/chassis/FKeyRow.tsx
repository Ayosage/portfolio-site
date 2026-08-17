'use client'
import Link from 'next/link'
import { useKeyboardNav } from './useKeyboardNav'
import { playClick } from '@/lib/sound'

const KEYS = [
  { label: 'F1 WORK', href: '/' },
  { label: 'F2 ABOUT', href: '/about' },
  { label: 'F3 CV', href: '/resume.pdf' },
  { label: 'F4 PING', href: '/contact', alert: true },
]

export function FKeyRow() {
  useKeyboardNav()
  return (
    <nav
      aria-label="primary"
      className="fixed inset-x-0 bottom-0 z-20 flex gap-1.5 border-t border-[var(--chassis-well)] bg-[var(--chassis)] p-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] sm:static sm:z-auto sm:mt-2 sm:border-t-0 sm:bg-transparent sm:p-0"
    >
      {KEYS.map((k) => (
        <Link
          key={k.href}
          href={k.href}
          onClick={playClick}
          className="flex-1 rounded-[3px] border border-[var(--chassis-well)] border-b-[3px] px-2 py-2.5 text-center text-[10px] active:translate-y-[2px] active:border-b sm:py-1.5"
          style={{
            background: k.alert ? 'var(--alert)' : 'var(--keycap)',
            color: k.alert ? 'var(--alert-text)' : 'var(--phosphor)',
          }}
        >
          {k.label}
        </Link>
      ))}
    </nav>
  )
}
