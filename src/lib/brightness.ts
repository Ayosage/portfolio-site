// BRIGHTNESS knob on the gauge column. Five detents; 3 is the factory setting.
// The level is stamped on <html> as data-brightness and CSS maps it to a veil
// over the CRT and the phosphor glow radius (see globals.css).
import { rig } from './rig'

export const BRIGHTNESS_LEVELS = [1, 2, 3, 4, 5] as const
export type Brightness = (typeof BRIGHTNESS_LEVELS)[number]
export const DEFAULT_BRIGHTNESS: Brightness = 3
export const BRIGHTNESS_KEY = 'bs01-brightness'

export function resolveBrightness(stored: string | null | undefined): Brightness {
  const n = Number(stored)
  return (BRIGHTNESS_LEVELS as readonly number[]).includes(n) ? (n as Brightness) : DEFAULT_BRIGHTNESS
}

export function nextBrightness(b: Brightness): Brightness {
  return (b === 5 ? 1 : b + 1) as Brightness
}

export function applyBrightness(b: Brightness): void {
  document.documentElement.dataset.brightness = String(b)
  rig.bright = b
  try {
    localStorage.setItem(BRIGHTNESS_KEY, String(b))
  } catch {
    /* private mode: level still applies for this page view */
  }
}
