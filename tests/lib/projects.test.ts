import { PROJECTS } from '@/lib/projects'

test('all four projects are live with a case study, one-liner and tags', () => {
  expect(PROJECTS.map((p) => p.slug)).toEqual(['stagepass', 'meridian', 'steward', 'cellarkeep'])
  for (const p of PROJECTS) {
    expect(p.hasCaseStudy).toBe(true)
    expect(p.oneLiner).not.toMatch(/in progress/i)
    expect(p.tags.length).toBeGreaterThanOrEqual(2)
  }
})
