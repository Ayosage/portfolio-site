import { describe, expect, it } from 'vitest'
import { PROJECTS, projectLinks } from '@/lib/projects'

describe('project links', () => {
  it('Meridian points at its live client and its source', () => {
    expect(projectLinks('meridian')).toEqual([
      { label: 'LIVE', href: 'https://meridian-client-fawn.vercel.app' },
      { label: 'SOURCE', href: 'https://github.com/Ayosage/meridian' },
    ])
  })
  it('Steward can be added to a server and has its source', () => {
    const links = projectLinks('steward')
    expect(links.map((l) => l.label)).toEqual(['ADD TO DISCORD', 'SOURCE'])
    expect(links[0]!.href).toMatch(/^https:\/\/discord\.com\/oauth2\/authorize\?client_id=\d+&scope=bot%20applications\.commands&permissions=\d+$/)
    expect(links[1]!.href).toBe('https://github.com/Ayosage/steward')
  })
  it('every link is an absolute https url and a project without links yields none', () => {
    for (const p of PROJECTS) for (const l of projectLinks(p.slug)) expect(l.href).toMatch(/^https:\/\//)
    expect(projectLinks('cellarkeep')).toEqual([])
  })
})
