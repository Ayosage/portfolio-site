import { BootOverlay } from './BootOverlay'
import { ScreenGarden } from './ScreenGarden'

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt-screen text-[var(--phosphor)] sm:min-h-[36rem]">
      <BootOverlay />
      {children}
      <ScreenGarden />
    </div>
  )
}
