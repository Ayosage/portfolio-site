'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useKeyboardNav } from './useKeyboardNav'
import { playClick } from '@/lib/sound'

const KEYS = [
  { label: 'F1 WORK', href: '/' },
  { label: 'F2 ABOUT', href: '/about' },
  { label: 'F3 CV', href: '/resume.pdf', external: true },
  { label: 'F4 PING', href: '/contact', alert: true },
]

export function FKeyRow() {
  useKeyboardNav()
  const pathname = usePathname()
  return (
    <nav
      aria-label="primary"
      className="fixed inset-x-0 bottom-0 z-20 flex gap-1.5 border-t border-[var(--chassis-well)] bg-[var(--chassis)] p-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] sm:static sm:z-auto sm:mt-2.5 sm:border-t-0 sm:bg-transparent sm:p-0"
    >
      {KEYS.map((k) => {
        const current = !k.external && pathname === k.href
        const shared = {
          onClick: playClick,
          'aria-current': current ? ('page' as const) : undefined,
          className: `fkey ${k.alert ? 'fkey-alert' : ''} flex-1 px-2 py-3 text-center text-[11px] tracking-[0.04em] sm:py-2`,
        }
        // Static files (the resume PDF) must bypass client-side routing.
        return k.external ? (
          <a key={k.href} href={k.href} {...shared}>
            {k.label}
          </a>
        ) : (
          <Link key={k.href} href={k.href} {...shared}>
            {k.label}
          </Link>
        )
      })}
    </nav>
  )
}
