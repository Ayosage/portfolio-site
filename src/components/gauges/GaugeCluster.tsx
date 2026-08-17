import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { ThemeDial } from './ThemeDial'
import { PixelGarden } from './PixelGarden'

export function GaugeCluster() {
  return (
    <aside aria-label="gauge cluster" className="flex flex-row gap-2 sm:flex-col">
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
