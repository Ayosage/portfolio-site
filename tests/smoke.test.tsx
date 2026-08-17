import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

test('home page renders', () => {
  render(<Home />)
  expect(screen.getByRole('main')).toBeInTheDocument()
})
