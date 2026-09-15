import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ back: vi.fn() }) }))

import NotFound, { metadata } from '@/app/not-found'

test('the 404 speaks the terminal voice and offers a way back', () => {
  render(<NotFound />)
  expect(screen.getByRole('heading', { level: 1, name: /no such file/i })).toBeInTheDocument()
  expect(screen.getByText('~/404')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /\[ESC\] BACK/ })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /WORK INDEX/ })).toHaveAttribute('href', '/')
})

test('the 404 stays out of the index', () => {
  expect(metadata.robots).toMatchObject({ index: false, follow: false })
})
