import { render, screen, within } from '@testing-library/react'
import { vi } from 'vitest'
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), back: vi.fn() }), notFound: vi.fn() }))
vi.mock('../../content/projects/stagepass.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/meridian.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/steward.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/wordy.mdx', () => ({ default: () => null }))
vi.mock('../../content/projects/cellarkeep.mdx', () => ({ default: () => null }))
import Home from '@/app/page'
import CaseStudy from '@/app/projects/[slug]/page'
import { gamesOf } from '@/lib/projects'

test('Steward lists Meridian and Wordy, in that order', () => {
  expect(gamesOf('steward').map((g) => g.slug)).toEqual(['meridian', 'wordy'])
  expect(gamesOf('wordy')).toEqual([])
})

test('the home index nests the games under Steward and gives Meridian no slot of its own', () => {
  render(<Home />)
  const nested = screen.getByRole('list', { name: /games on steward/i })
  expect(within(nested).getByRole('link', { name: /meridian/i })).toHaveAttribute('href', '/projects/meridian')
  expect(within(nested).getByRole('link', { name: /wordy/i })).toHaveAttribute('href', '/projects/wordy')
  expect(screen.getAllByRole('link', { name: /meridian/i })).toHaveLength(1)
  expect(screen.getByText('3 SLOTS')).toBeInTheDocument()
})

test('the Steward page opens with its intro, then each game with a description and links', async () => {
  render(await CaseStudy({ params: Promise.resolve({ slug: 'steward' }) }))
  expect(screen.getByText(/Steward runs game nights from Discord/)).toBeInTheDocument()
  const games = screen.getByTestId('games')
  expect(within(games).getByRole('link', { name: /meridian/i })).toHaveAttribute('href', '/projects/meridian')
  expect(within(games).getByText(/Catan base game/)).toBeInTheDocument()
  expect(within(games).getByText(/Wordle as a race/)).toBeInTheDocument()
  const live = within(games).getAllByRole('link', { name: /^LIVE/ })
  expect(live.map((l) => l.getAttribute('href'))).toEqual(['https://meridian-client-fawn.vercel.app', 'https://wordy-client.vercel.app'])
  expect(within(games).getAllByRole('link', { name: /^SOURCE/ })).toHaveLength(2)
})

test('a game page has no games block', async () => {
  render(await CaseStudy({ params: Promise.resolve({ slug: 'wordy' }) }))
  expect(screen.queryByTestId('games')).not.toBeInTheDocument()
})
