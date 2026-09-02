import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('@/app/contact/actions', () => ({ sendPing: vi.fn() }))
import { ContactForm } from '@/app/contact/ContactForm'

test('contact opens with the ~/contact path line like every other screen', () => {
  render(<ContactForm />)
  expect(screen.getByText('~/contact')).toBeInTheDocument()
})
