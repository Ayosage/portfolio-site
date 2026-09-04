import { FEATURED } from '@/lib/projects'
import { Cartridge } from './Cartridge'

export function DiskBay() {
  return (
    <section aria-label="disk bay — selected work" className="mt-7 border sm:mt-9 border-[var(--hairline)]">
      <p className="flex justify-between border-b border-[var(--hairline)] px-2 py-1 text-[10px] tracking-[0.06em] text-[var(--phosphor-dim)]">
        <span>DISK BAY — SELECT MEDIA</span>
        <span>{FEATURED.length} SLOTS</span>
      </p>
      <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-4">
        {FEATURED.map((p) => (
          <Cartridge key={p.slug} project={p} />
        ))}
      </div>
    </section>
  )
}
