import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))
import Home from '@/app/page'

test('home page renders', () => {
  render(<Home />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
