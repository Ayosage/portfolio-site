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
    <nav aria-label="primary" className="mt-2 flex gap-1.5">
      {KEYS.map((k) => (
        <Link
          key={k.href}
          href={k.href}
          onClick={playClick}
          className="flex-1 rounded-[3px] border border-[var(--chassis-well)] border-b-[3px] px-2 py-1.5 text-center text-[10px] active:translate-y-[2px] active:border-b"
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
