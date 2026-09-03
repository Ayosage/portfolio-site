import { render, screen } from '@testing-library/react'
import About from '@/app/about/page'

test('about opens with the ~/about path line like every other screen', () => {
  render(<About />)
  expect(screen.getByText('~/about')).toBeInTheDocument()
})

test('about carries a spec sheet with role, stack and availability rows', () => {
  render(<About />)
  expect(screen.getByRole('table', { name: /spec sheet/i })).toBeInTheDocument()
  expect(screen.getByRole('rowheader', { name: /role/i })).toBeInTheDocument()
  expect(screen.getByRole('rowheader', { name: /stack/i })).toBeInTheDocument()
  expect(screen.getByRole('rowheader', { name: /availability/i })).toBeInTheDocument()
  expect(screen.getByText(/open to work/i)).toBeInTheDocument()
})

test('about keeps the resume download link', () => {
  render(<About />)
  expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute('href', '/resume.pdf')
})
