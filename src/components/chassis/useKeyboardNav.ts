'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { keysEnabled } from '@/lib/keys'

const MAP: Record<string, string> = {
  '1': '/', w: '/',
  '2': '/about', a: '/about',
  '3': '/cv', c: '/cv',
  '4': '/contact', p: '/contact',
}

export function useKeyboardNav() {
  const router = useRouter()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!keysEnabled()) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const dest = MAP[e.key.toLowerCase()]
      if (dest) router.push(dest)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])
}
