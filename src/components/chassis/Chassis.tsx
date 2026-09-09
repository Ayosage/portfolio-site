import { TopBezel } from './TopBezel'
import { FKeyRow } from './FKeyRow'
import { PointerParallax } from './PointerParallax'
import { Screen } from '@/components/screen/Screen'
import { GaugeCluster } from '@/components/gauges/GaugeCluster'
import { DiskBay } from '@/components/diskbay/DiskBay'
import { BenchGarden } from '@/components/garden/BenchGarden'

export function Chassis({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BenchGarden />
      <div className="stage">
        <div
          data-rig
          className="rig relative flex h-dvh w-[min(100vw,1080px)] flex-col px-1 pb-20 pt-1 sm:h-[calc(100dvh-2rem)] sm:rounded-lg sm:px-[18px] sm:pb-[18px] sm:pt-[14px]"
        >
          <PointerParallax />
          <i data-rivet aria-hidden="true" className="rivet hidden left-1.5 top-1.5 sm:block" />
          <i data-rivet aria-hidden="true" className="rivet hidden right-1.5 top-1.5 sm:block" />
          <i data-rivet aria-hidden="true" className="rivet rivet-rust hidden bottom-1.5 left-1.5 sm:block" />
          <i data-rivet aria-hidden="true" className="rivet hidden bottom-1.5 right-1.5 sm:block" />
          <TopBezel />
          <div className="grid min-h-0 flex-1 grid-rows-[1fr_auto] gap-1.5 sm:grid-rows-none sm:grid-cols-[1fr_140px] sm:gap-2.5">
            <Screen>{children}</Screen>
            <GaugeCluster />
          </div>
          <DiskBay />
          <FKeyRow />
        </div>
      </div>
    </>
  )
}
