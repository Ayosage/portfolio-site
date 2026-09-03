'use client'
import { useEffect, type RefObject } from 'react'
import { usePathname } from 'next/navigation'

// The screen pane lives in the root layout and survives route changes, so a
// case study read to the bottom would otherwise hand you Home mid-scroll.
export function ScrollReset({ paneRef }: { paneRef: RefObject<HTMLElement | null> }) {
  const pathname = usePathname()
  useEffect(() => {
    if (paneRef.current) paneRef.current.scrollTop = 0
  }, [pathname, paneRef])
  return null
}
