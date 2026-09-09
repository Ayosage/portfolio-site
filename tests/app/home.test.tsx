import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))
import Home from '@/app/page'

test('hero shows name at heading level 1', () => {
  render(<Home />)
  expect(screen.getByRole('heading', { level: 1, name: /brandon smith/i })).toBeInTheDocument()
})
test('ports footer has the three contact links', () => {
  render(<Home />)
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/Ayosage')
  expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
})

test('email port routes to the contact form, not a mailto', () => {
  render(<Home />)
  const email = screen.getByRole('link', { name: /email/i })
  expect(email).toHaveAttribute('href', '/contact')
  expect(email).not.toHaveAttribute('target')
})
