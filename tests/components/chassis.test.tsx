import { render, screen } from '@testing-library/react'
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
