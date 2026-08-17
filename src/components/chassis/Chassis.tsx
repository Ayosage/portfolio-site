import { TopBezel } from './TopBezel'
import { Screen } from '@/components/screen/Screen'
import { FKeyRow } from './FKeyRow'

export function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl p-2 sm:p-4">
      <TopBezel />
      <div className="grid gap-2 sm:grid-cols-[1fr_96px]">
        <Screen>{children}</Screen>
        <aside aria-label="gauge cluster" className="flex flex-row gap-2 sm:flex-col" />
      </div>
      <FKeyRow />
      <p className="mt-1 flex items-center justify-between text-[8px] tracking-[0.2em] text-[var(--phosphor-dim)]">
        <span aria-hidden="true">⊕</span>
        MADE BY HAND ▪ RUNS ON SUNLIGHT
        <span aria-hidden="true">⊕</span>
      </p>
    </div>
  )
}
