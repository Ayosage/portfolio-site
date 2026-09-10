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
  expect(screen.getByText(/remote/i)).toBeInTheDocument()
})

test('github and linkedin ports open in a new tab without a referrer', () => {
  render(<About />)
  for (const name of [/github/i, /linkedin/i]) {
    const link = screen.getByRole('link', { name })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }
})

test('about resume button saves the PDF instead of opening it', () => {
  render(<About />)
  const link = screen.getByRole('link', { name: /resume/i })
  expect(link).toHaveAttribute('href', '/resume.pdf')
  expect(link).toHaveAttribute('download')
  expect(link).not.toHaveAttribute('target')
})
