'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/projects'

export function Cartridge({ project }: { project: Project }) {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)
  const spinUpTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (spinUpTimeout.current) clearTimeout(spinUpTimeout.current)
    }
  }, [])

  if (!project.hasCaseStudy) {
    return (
      <div className="flex flex-col gap-1 border border-[var(--hairline)] p-2.5 text-[11px] text-[var(--phosphor-dim)]">
        <span className="font-bold tracking-wider">▢ {project.title.toUpperCase()}</span>
        <span className="leading-snug">EJECTED — {project.oneLiner.toUpperCase()}</span>
      </div>
    )
  }

  const href = `/projects/${project.slug}`
  return (
    <a
      href={href}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
        e.preventDefault()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          router.push(href)
          return
        }
        setSpinning(true)
        spinUpTimeout.current = setTimeout(() => router.push(href), 500)
      }}
      className="flex flex-col gap-1 border border-[var(--phosphor)] bg-[color-mix(in_srgb,var(--phosphor)_10%,transparent)] p-2.5 text-[11px]"
    >
      <span className="font-bold tracking-wider">▣ {project.title.toUpperCase()}</span>
      <span className="leading-snug text-[var(--phosphor-dim)]">
        {spinning ? '▸ SPIN-UP…' : project.oneLiner}
      </span>
      <span className="mt-0.5 text-[10px] tracking-[0.08em] text-[var(--phosphor-dim)]">
        {project.tags.join(' / ')}
      </span>
    </a>
  )
}
