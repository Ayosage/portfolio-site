import { vi } from 'vitest'
vi.mock('@/app/contact/actions', () => ({ sendPing: vi.fn() }))
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/app/contact/ContactForm'

test('form carries a honeypot that is hidden from people and assistive tech', () => {
  const { container } = render(<ContactForm />)
  const trap = container.querySelector('input[name="website"]') as HTMLInputElement
  expect(trap).not.toBeNull()
  expect(trap.tabIndex).toBe(-1)
  expect(trap.getAttribute('autocomplete')).toBe('off')
  expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  expect(screen.queryByLabelText(/website/i)).toBeNull()
})

test('form stamps when it was rendered', () => {
  const { container } = render(<ContactForm />)
  const t = container.querySelector('input[name="t"]') as HTMLInputElement
  expect(Number(t.value)).toBeGreaterThan(1_600_000_000_000)
})
