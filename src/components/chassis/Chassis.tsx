import { TopBezel } from './TopBezel'
import { Screen } from '@/components/screen/Screen'
import { FKeyRow } from './FKeyRow'
import { GaugeCluster } from '@/components/gauges/GaugeCluster'

export function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <div className="rig relative mx-auto flex h-dvh max-w-5xl flex-col px-1 pb-20 pt-1 sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-md sm:px-5 sm:pb-4 sm:pt-4">
      <i data-rivet aria-hidden="true" className="rivet hidden left-2 top-2 sm:block" />
      <i data-rivet aria-hidden="true" className="rivet hidden right-2 top-2 sm:block" />
      <i data-rivet aria-hidden="true" className="rivet rivet-rust hidden bottom-2 left-2 sm:block" />
      <i data-rivet aria-hidden="true" className="rivet hidden bottom-2 right-2 sm:block" />
      <TopBezel />
      <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto] gap-1.5 sm:grid-rows-none sm:grid-cols-[1fr_112px] sm:gap-2">
        <Screen>{children}</Screen>
        <GaugeCluster />
      </div>
      <FKeyRow />
      <p className="mt-1 flex items-center justify-between text-[9px] tracking-[0.2em] text-[var(--chrome-dim)]">
        <span aria-hidden="true">⊕</span>
        MADE BY HAND ▪ RUNS ON SUNLIGHT
        <span aria-hidden="true">⊕</span>
      </p>
    </div>
  )
}
