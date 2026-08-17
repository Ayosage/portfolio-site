'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/lib/projects'

export function Cartridge({ project }: { project: Project }) {
  const router = useRouter()
  const [spinning, setSpinning] = useState(false)

  if (!project.hasCaseStudy) {
    return (
      <div className="border border-[var(--hairline)] p-2 text-center text-[9px] text-[var(--phosphor-dim)]">
        ▢ {project.title.toUpperCase()}
        <br />
        EJECTED — {project.oneLiner.toUpperCase()}
      </div>
    )
  }

  const href = `/projects/${project.slug}`
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault()
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          router.push(href)
          return
        }
        setSpinning(true)
        setTimeout(() => router.push(href), 500)
      }}
      className="border border-[var(--phosphor)] bg-[color-mix(in_srgb,var(--phosphor)_10%,transparent)] p-2 text-center text-[9px]"
    >
      ▣ {project.title.toUpperCase()}
      <br />
      <span className="text-[var(--phosphor-dim)]">
        {spinning ? '▸ SPIN-UP…' : project.tags.join(' / ') || project.oneLiner.toUpperCase()}
      </span>
    </a>
  )
}
