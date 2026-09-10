'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FEATURED } from '@/lib/projects'
import { RASTER_MS } from '@/lib/motion'
import { Cartridge } from './Cartridge'

const slugOf = (pathname: string) => FEATURED.find((p) => pathname === `/projects/${p.slug}`)?.slug ?? null

/** Hardware bay under the screen. Seating a cartridge boots its case study. */
export function DiskBay() {
  const pathname = usePathname()
  const [status, setStatus] = useState(() => {
    const s = slugOf(pathname)
    return s ? `DRIVE ▸ ${s.toUpperCase()} OK` : 'READY'
  })
  const pending = useRef<string | null>(null)

  useEffect(() => {
    const slug = slugOf(pathname)
    if (slug && pending.current === slug) {
      pending.current = null
      setStatus(`READING ${slug.toUpperCase()}…`)
      const id = setTimeout(() => setStatus(`DRIVE ▸ ${slug.toUpperCase()} OK`), RASTER_MS)
      return () => clearTimeout(id)
    }
    setStatus(slug ? `DRIVE ▸ ${slug.toUpperCase()} OK` : 'READY')
  }, [pathname])

  return (
    <section aria-label="disk bay: selected work" className="bay mt-2">
      <p className="col-span-full flex justify-between gap-3 px-0.5 pb-0.5 text-[10px] tracking-[0.14em] text-[var(--chrome-dim)]">
        <span>DISK BAY ▪ INSERT MEDIA</span>
        <span aria-live="polite" className="text-[var(--phosphor)]">
          {status}
        </span>
        <span className="hidden sm:inline">{FEATURED.length} SLOTS</span>
      </p>
      {FEATURED.map((p) => (
        <Cartridge
          key={p.slug}
          project={p}
          seated={pathname === `/projects/${p.slug}`}
          onSeat={(slug) => {
            pending.current = slug
            setStatus('SEATING…')
          }}
        />
      ))}
    </section>
  )
}
