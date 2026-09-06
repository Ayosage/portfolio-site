import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { ThemeDial } from './ThemeDial'
import { Scope } from './Scope'
import { BrightnessKnob } from './BrightnessKnob'

export function GaugeCluster() {
  return (
    <aside
      aria-label="gauge cluster"
      className="grid grid-cols-4 gap-1 sm:flex sm:flex-col sm:gap-2 [&>*]:min-w-0"
    >
      <SolarMeter />
      <UptimeGauge />
      <ThemeDial />
      <div className="border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[10px] text-[var(--chrome-dim)]">
        STATUS
        <div className="whitespace-nowrap text-[var(--phosphor)]">
          <span className="sm:hidden">OPEN</span>
          <span className="hidden sm:inline">● OPEN TO WORK</span>
        </div>
      </div>
      <Scope />
      <BrightnessKnob />
      <div data-grille aria-hidden="true" className="grille hidden min-h-8 flex-1 sm:block" />
    </aside>
  )
}
