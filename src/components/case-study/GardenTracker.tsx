'use client'
import { useEffect } from 'react'
import { recordSection } from '@/lib/garden'

export function GardenTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const headings = document.querySelectorAll('[data-garden-section]')
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            recordSection(`${slug}:${e.target.getAttribute('data-garden-section')}`)
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.5 },
    )
    headings.forEach((h) => io.observe(h))
    return () => io.disconnect()
  }, [slug])
  return null
}
