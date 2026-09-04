import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

import { DiskBay } from '@/components/diskbay/DiskBay'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

test('every slot is a live link to its case study', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  for (const slug of ['meridian', 'steward', 'cellarkeep', 'misc']) {
    expect(screen.getByRole('link', { name: new RegExp(slug, 'i') })).toHaveAttribute('href', `/projects/${slug}`)
  }
  expect(screen.queryByText(/EJECTED/)).not.toBeInTheDocument()
  expect(screen.getByText('4 SLOTS')).toBeInTheDocument()
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

test('click spins up then navigates', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /meridian/i }))
  expect(screen.getByText(/SPIN-UP/)).toBeInTheDocument()
  expect(push).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(600))
  expect(push).toHaveBeenCalledWith('/projects/meridian')
  vi.useRealTimers()
})

test('reduced motion navigates immediately', () => {
  mockReducedMotion(true)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /meridian/i }))
  expect(push).toHaveBeenCalledWith('/projects/meridian')
})

test('cmd/ctrl-click lets the browser open a new tab instead of intercepting', () => {
  mockReducedMotion(false)
  push.mockClear()
  render(<DiskBay />)
  const link = screen.getByRole('link', { name: /meridian/i })
  const event = fireEvent.click(link, { metaKey: true })
  expect(event).toBe(true) // not preventDefault()'d — the browser is free to handle it
  expect(push).not.toHaveBeenCalled()
  expect(screen.queryByText(/SPIN-UP/)).not.toBeInTheDocument()
})
