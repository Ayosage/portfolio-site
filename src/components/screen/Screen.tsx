import { BootOverlay } from './BootOverlay'

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt-screen text-[var(--phosphor)]">
      <BootOverlay />
      {children}
    </div>
  )
}
