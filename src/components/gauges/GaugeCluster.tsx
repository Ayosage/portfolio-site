import { SolarMeter } from './SolarMeter'
import { UptimeGauge } from './UptimeGauge'
import { Weather } from './Weather'
import { Scope } from './Scope'
import { BrightnessKnob } from './BrightnessKnob'

export function GaugeCluster() {
  return (
    <aside
      aria-label="gauge cluster"
      className="gauge-cluster grid grid-cols-4 gap-1 sm:flex sm:min-h-0 sm:flex-col sm:gap-2 sm:overflow-hidden [&>*]:min-w-0"
    >
      <SolarMeter />
      <UptimeGauge />
      <Weather />
      <div className="well">
        STATUS
        <div className="well-val">
          <span aria-hidden="true" className="lens mr-1 !h-[7px] !w-[7px] align-[-1px]" />
          <span className="sm:hidden">OPEN</span>
          <span className="hidden sm:inline">OPEN TO WORK</span>
        </div>
      </div>
      <Scope />
      <BrightnessKnob />
      <div data-grille aria-hidden="true" className="grille hidden min-h-8 flex-1 sm:block" />
    </aside>
  )
}
