import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({ useRouter: () => ({ back: vi.fn() }) }))

import MiscIndex, { metadata } from '@/app/projects/misc/page'
import { MISC } from '@/lib/misc'

test('every misc item renders as name, links, stack', () => {
  render(<MiscIndex />)
  for (const group of MISC) {
    expect(screen.getByRole('heading', { name: new RegExp(group.category, 'i') })).toBeInTheDocument()
    for (const item of group.items) {
      const row = screen.getByText(item.name.toUpperCase()).closest('li')!
      expect(row).toHaveTextContent(item.stack)
      for (const link of item.links) {
        expect(within(row).getByRole('link', { name: new RegExp(link.label) })).toHaveAttribute('href', link.href)
      }
    }
  }
})

test('external links open in a new tab without a referrer; internal ones stay in-app', () => {
  render(<MiscIndex />)
  const row = screen.getByText('STEEPLE LOFTS').closest('li')!
  const live = within(row).getByRole('link', { name: /LIVE/ })
  expect(live).toHaveAttribute('href', 'https://www.steepleapartments.com')
  expect(live).toHaveAttribute('target', '_blank')
  expect(live).toHaveAttribute('rel', 'noopener noreferrer')
  const notes = screen.getByRole('link', { name: /NOTES/ })
  expect(notes).toHaveAttribute('href', '/projects/stagepass')
  expect(notes).not.toHaveAttribute('target')
})

test('page carries canonical metadata for /projects/misc', () => {
  expect(metadata.alternates?.canonical).toBe('/projects/misc')
  expect(metadata.title).toBe('Misc')
})
