import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { ThemeDial } from './ThemeDial'
import { PixelGarden } from './PixelGarden'

export function GaugeCluster() {
  return (
    <aside
      aria-label="gauge cluster"
      className="flex flex-row gap-1.5 overflow-x-auto sm:flex-col sm:gap-2 sm:overflow-visible [&>*]:min-w-[76px] [&>*]:shrink-0 sm:[&>*]:min-w-0"
    >
      <SolarMeter />
      <UptimeGauge />
      <ThemeDial />
      <PixelGarden />
      <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--chrome-dim)]">
        STATUS
        <div className="text-[var(--phosphor)]">● OPEN TO WORK</div>
      </div>
    </aside>
  )
}
