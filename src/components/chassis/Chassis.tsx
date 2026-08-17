import { TopBezel } from './TopBezel'
import { Screen } from '@/components/screen/Screen'
import { FKeyRow } from './FKeyRow'
import { GaugeCluster } from '@/components/gauges/GaugeCluster'

export function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-1 pb-20 pt-1 sm:p-4 sm:pb-4">
      <TopBezel />
      <div className="grid gap-1.5 sm:gap-2 sm:grid-cols-[1fr_96px]">
        <Screen>{children}</Screen>
        <GaugeCluster />
      </div>
      <FKeyRow />
      <p className="mt-1 flex items-center justify-between text-[8px] tracking-[0.2em] text-[var(--chrome-dim)]">
        <span aria-hidden="true">⊕</span>
        MADE BY HAND ▪ RUNS ON SUNLIGHT
        <span aria-hidden="true">⊕</span>
      </p>
    </div>
  )
}
