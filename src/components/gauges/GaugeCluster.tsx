import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { ThemeDial } from './ThemeDial'

export function GaugeCluster() {
  return (
    <aside
      aria-label="gauge cluster"
      className="grid grid-cols-4 gap-1 sm:flex sm:flex-col sm:gap-2 [&>*]:min-w-0"
    >
      <SolarMeter />
      <UptimeGauge />
      <ThemeDial />
      <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--chrome-dim)]">
        STATUS
        <div className="text-[var(--phosphor)]">● OPEN TO WORK</div>
      </div>
    </aside>
  )
}
