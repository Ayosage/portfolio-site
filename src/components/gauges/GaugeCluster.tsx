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
    </aside>
  )
}
