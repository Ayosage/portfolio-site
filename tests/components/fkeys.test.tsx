import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

const push = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/',
}))

import { FKeyRow } from '@/components/chassis/FKeyRow'
import { setKeysEnabled } from '@/lib/keys'

test('renders four real links', () => {
  render(<FKeyRow />)
  expect(screen.getByRole('link', { name: /F1 WORK/i })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: /F2 ABOUT/i })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: /F3 CV/i })).toHaveAttribute('href', '/resume.pdf')
  expect(screen.getByRole('link', { name: /F4 PING/i })).toHaveAttribute('href', '/contact')
})

test('keyboard shortcut navigates', () => {
  render(<FKeyRow />)
  fireEvent.keyDown(window, { key: '2' })
  expect(push).toHaveBeenCalledWith('/about')
})

test('shortcuts ignored when KEYS switch is off', () => {
  push.mockClear()
  setKeysEnabled(false)
  render(<FKeyRow />)
  fireEvent.keyDown(window, { key: '2' })
  expect(push).not.toHaveBeenCalled()
  setKeysEnabled(true)
})

test('shortcuts ignored while typing', () => {
  push.mockClear()
  render(
    <div>
      <FKeyRow />
      <input aria-label="field" />
    </div>,
  )
  const input = screen.getByLabelText('field')
  input.focus()
  fireEvent.keyDown(input, { key: '2' })
  expect(push).not.toHaveBeenCalled()
})
