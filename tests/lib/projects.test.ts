import { PROJECTS, FEATURED } from '@/lib/projects'

test('four featured slots, StagePass demoted to the misc index but still routable', () => {
  expect(FEATURED.map((p) => p.slug)).toEqual(['meridian', 'steward', 'cellarkeep', 'misc'])
  expect(PROJECTS.map((p) => p.slug)).toEqual(['meridian', 'steward', 'cellarkeep', 'misc', 'stagepass'])
  for (const p of PROJECTS) {
    expect(p.hasCaseStudy).toBe(true)
    expect(p.oneLiner).not.toMatch(/in progress/i)
    expect(p.tags.length).toBeGreaterThanOrEqual(2)
  }
})
