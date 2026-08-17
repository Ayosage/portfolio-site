import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'
import { BootOverlay } from '@/components/screen/BootOverlay'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia
}

beforeEach(() => sessionStorage.clear())

test('shows on first visit and marks session booted', () => {
  mockReducedMotion(false)
  render(<BootOverlay />)
  expect(screen.getByText(/LOADING PORTFOLIO.SYS/)).toBeInTheDocument()
  expect(sessionStorage.getItem('bs01-booted')).toBe('1')
})

test('any key skips it', () => {
  mockReducedMotion(false)
  render(<BootOverlay />)
  fireEvent.keyDown(window, { key: 'x' })
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})

test('auto-dismisses after 1.2s', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  render(<BootOverlay />)
  act(() => vi.advanceTimersByTime(1300))
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
  vi.useRealTimers()
})

test('never shows twice per session', () => {
  mockReducedMotion(false)
  sessionStorage.setItem('bs01-booted', '1')
  render(<BootOverlay />)
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})

test('respects prefers-reduced-motion', () => {
  mockReducedMotion(true)
  render(<BootOverlay />)
  expect(screen.queryByText(/LOADING PORTFOLIO.SYS/)).not.toBeInTheDocument()
})
