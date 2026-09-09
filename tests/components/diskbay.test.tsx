import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
let pathname = '/'
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => pathname }))

import { DiskBay } from '@/components/diskbay/DiskBay'
import { SPIN_UP_MS, RASTER_MS } from '@/lib/motion'
import { rig } from '@/lib/rig'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

beforeEach(() => {
  pathname = '/'
  push.mockClear()
  rig.boot = 1
})

test('every slot is a live link to its case study', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  for (const slug of ['meridian', 'steward', 'cellarkeep', 'misc']) {
    expect(screen.getByRole('link', { name: new RegExp(slug, 'i') })).toHaveAttribute('href', `/projects/${slug}`)
  }
  expect(screen.getByText('4 SLOTS')).toBeInTheDocument()
  expect(screen.getByText('READY')).toBeInTheDocument()
})

test('StagePass keeps its page but is not in the bay', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  expect(screen.queryByRole('link', { name: /stagepass/i })).not.toBeInTheDocument()
})

test('a cartridge label shows title, one-liner and tags', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  const link = screen.getByRole('link', { name: /cellarkeep/i })
  expect(link).toHaveTextContent(/CELLARKEEP/)
  expect(link).toHaveTextContent(/cellar/i)
  expect(link).toHaveTextContent(/NEXT\.JS/)
})

test('click seats the cartridge, collapses the picture, then navigates within SPIN_UP_MS', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /meridian/i }))
  // The bay header narrates it and the cartridge label echoes it.
  expect(screen.getAllByText(/SEATING/)).toHaveLength(2)
  expect(screen.getByRole('link', { name: /meridian/i })).toHaveAttribute('data-in', 'true')
  expect(push).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(SPIN_UP_MS - 1))
  expect(push).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(1))
  expect(push).toHaveBeenCalledWith('/projects/meridian')
  vi.useRealTimers()
})

test('once its page arrives the bay reads the drive, then reports OK', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  const { rerender } = render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /meridian/i }))
  act(() => vi.advanceTimersByTime(SPIN_UP_MS))
  pathname = '/projects/meridian'
  rerender(<DiskBay />)
  expect(screen.getByText(/READING MERIDIAN/)).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /meridian/i })).toHaveAttribute('aria-current', 'page')
  act(() => vi.advanceTimersByTime(RASTER_MS))
  expect(screen.getByText(/DRIVE ▸ MERIDIAN OK/)).toBeInTheDocument()
  vi.useRealTimers()
})

test('reduced motion navigates immediately, without the seat animation', () => {
  mockReducedMotion(true)
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /meridian/i }))
  expect(push).toHaveBeenCalledWith('/projects/meridian')
  expect(screen.queryByText(/SEATING/)).not.toBeInTheDocument()
})

test('cmd/ctrl-click lets the browser open a new tab instead of intercepting', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  const link = screen.getByRole('link', { name: /meridian/i })
  const event = fireEvent.click(link, { metaKey: true })
  expect(event).toBe(true) // not preventDefault()'d — the browser is free to handle it
  expect(push).not.toHaveBeenCalled()
  expect(screen.queryByText(/SEATING/)).not.toBeInTheDocument()
})
