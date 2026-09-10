import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

const back = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ back }) }))

import { SectionHeading } from '@/components/case-study/SectionHeading'
import { CaseStudyMeta } from '@/components/case-study/CaseStudyMeta'
import { EscBack } from '@/components/case-study/EscBack'

test('section heading shows the numbered title', () => {
  render(<SectionHeading index={1} title="The Problem" />)
  expect(screen.getByRole('heading', { name: /01 ▪ THE PROBLEM/ })).toBeInTheDocument()
})

test('meta strip renders all fields', () => {
  render(<CaseStudyMeta role="Full-stack" stack="Next / Solidity" year="2026" live />)
  expect(screen.getByText(/ROLE: FULL-STACK/i)).toBeInTheDocument()
  expect(screen.getByText(/● LIVE/)).toBeInTheDocument()
})

test('Escape goes back', () => {
  render(<EscBack />)
  fireEvent.keyDown(window, { key: 'Escape' })
  expect(back).toHaveBeenCalled()
})
