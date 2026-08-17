import { render, screen, fireEvent, act } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

import { DiskBay } from '@/components/diskbay/DiskBay'

function mockReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({ matches }) as unknown as typeof window.matchMedia
}

test('stagepass is a real link, empty slots are not', () => {
  mockReducedMotion(false)
  render(<DiskBay />)
  expect(screen.getByRole('link', { name: /stagepass/i })).toHaveAttribute('href', '/projects/stagepass')
  expect(screen.queryByRole('link', { name: /meridian/i })).not.toBeInTheDocument()
  expect(screen.getAllByText(/EJECTED/)).toHaveLength(3)
})

test('click spins up then navigates', () => {
  vi.useFakeTimers()
  mockReducedMotion(false)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /stagepass/i }))
  expect(screen.getByText(/SPIN-UP/)).toBeInTheDocument()
  expect(push).not.toHaveBeenCalled()
  act(() => vi.advanceTimersByTime(600))
  expect(push).toHaveBeenCalledWith('/projects/stagepass')
  vi.useRealTimers()
})

test('reduced motion navigates immediately', () => {
  mockReducedMotion(true)
  push.mockClear()
  render(<DiskBay />)
  fireEvent.click(screen.getByRole('link', { name: /stagepass/i }))
  expect(push).toHaveBeenCalledWith('/projects/stagepass')
})
