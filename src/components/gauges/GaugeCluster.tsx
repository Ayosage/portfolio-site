import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { ThemeDial } from './ThemeDial'

export function GaugeCluster() {
  return (
    <aside aria-label="gauge cluster" className="flex flex-row gap-2 sm:flex-col">
      <SolarMeter />
      <UptimeGauge />
      <ThemeDial />
      {/* pixel garden: task 14 */}
      <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[8px] text-[var(--phosphor-dim)]">
        STATUS
        <div className="text-[var(--phosphor)]">● OPEN TO WORK</div>
      </div>
    </aside>
  )
}
