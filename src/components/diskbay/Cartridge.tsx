'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/projects'
import { SPIN_UP_MS } from '@/lib/motion'
import { collapse, reducedMotion } from '@/lib/rig'
import { recordInteraction } from '@/lib/growth'
import { playClick } from '@/lib/sound'

export function Cartridge({
  project,
  seated,
  onSeat,
}: {
  project: Project
  seated: boolean
  onSeat: (slug: string) => void
}) {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  // A seated cartridge is done spinning once its page has arrived.
  useEffect(() => {
    if (seated) setSpinning(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [seated])

  const href = `/projects/${project.slug}`
  return (
    <div className="slot">
      <a
        href={href}
        data-in={seated || spinning ? 'true' : undefined}
        aria-current={seated ? 'page' : undefined}
        className="cart"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          if (seated) return
          playClick()
          if (reducedMotion()) {
            router.push(href)
            return
          }
          setSpinning(true)
          onSeat(project.slug)
          recordInteraction(2)
          collapse()
          timer.current = setTimeout(() => router.push(href), SPIN_UP_MS)
        }}
      >
        <span className="cart-label">
          <b className="block text-[11px] tracking-[0.06em]">▣ {project.title.toUpperCase()}</b>
          <span className="hidden text-[10px] opacity-85 sm:block">{spinning ? '▸ SEATING…' : project.oneLiner}</span>
          <small className="mt-0.5 hidden text-[10px] tracking-[0.08em] opacity-75 sm:block">{project.tags.join(' / ')}</small>
        </span>
        <span className="cart-led" aria-hidden="true" />
      </a>
      <span className="slot-sled" aria-hidden="true" />
    </div>
  )
}
