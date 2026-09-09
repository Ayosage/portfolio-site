// Single source of truth for the cartridge spin-up delay — the setTimeout in
// Cartridge.tsx, the CSS pulse duration, and the tests all read this so the
// three can't drift apart.
export const SPIN_UP_MS = 250
