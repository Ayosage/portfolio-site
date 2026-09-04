import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
}))

import { render, screen } from '@testing-library/react'

beforeEach(() => {
  sessionStorage.setItem('bs01-booted', '1')
})
import userEvent from '@testing-library/user-event'
import { Chassis } from '@/components/chassis/Chassis'
import { HardwareSwitch } from '@/components/chassis/HardwareSwitch'

test('chassis shows model label and serial', () => {
  render(<Chassis>content</Chassis>)
  expect(screen.getByText(/BS-01/)).toBeInTheDocument()
  expect(screen.getByText(/SN dev/i)).toBeInTheDocument()
})

test('children render inside the screen region', () => {
  render(<Chassis>hello-screen</Chassis>)
  expect(screen.getByText('hello-screen')).toBeInTheDocument()
})

test('bezel has a KEYS switch for disabling shortcuts', () => {
  render(<Chassis>content</Chassis>)
  expect(screen.getByRole('switch', { name: /keys/i })).toBeInTheDocument()
})

test('switch button carries its id as data-switch for theme CSS', () => {
  render(
    <HardwareSwitch id="scan" label="SCANLINES" storageKey="k" onFlip={() => {}} />,
  )
  expect(screen.getByRole('switch', { name: /scanlines/i })).toHaveAttribute(
    'data-switch',
    'scan',
  )
})

test('scanline switch flips html data attribute', async () => {
  render(
    <HardwareSwitch
      id="scan"
      label="SCANLINES"
      storageKey="bs01-scanlines"
      onFlip={(on) =>
        (document.documentElement.dataset.scanlines = on ? 'on' : 'off')
      }
    />,
  )
  await userEvent.click(screen.getByRole('switch', { name: /scanlines/i }))
  expect(document.documentElement.dataset.scanlines).toBe('off')
})

test('screen content lives in a focusable scroll pane, not the page', () => {
  render(<Chassis>long-content</Chassis>)
  const pane = screen.getByRole('region', { name: /screen/i })
  expect(pane).toContainElement(screen.getByText('long-content'))
  expect(pane).toHaveAttribute('tabindex', '0')
  expect(pane.className).toMatch(/overflow-y-auto/)
})

test('chassis plate has four decorative rivets, hidden from assistive tech', () => {
  const { container } = render(<Chassis>content</Chassis>)
  const rivets = container.querySelectorAll('[data-rivet]')
  expect(rivets).toHaveLength(4)
  rivets.forEach((r) => expect(r).toHaveAttribute('aria-hidden', 'true'))
})
