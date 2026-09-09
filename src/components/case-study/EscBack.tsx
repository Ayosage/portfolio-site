'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Escape key and a tappable/clickable control both return to the bay. */
export function EscBack() {
  const router = useRouter()
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') router.back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])
  return (
    <button type="button" onClick={() => router.back()}>
      [ESC] BACK
    </button>
  )
}
