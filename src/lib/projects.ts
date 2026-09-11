export type ProjectLink = { label: 'LIVE' | 'SOURCE' | 'ADD TO DISCORD'; href: string }

export type Project = {
  slug: string
  title: string
  oneLiner: string
  tags: string[]
  /** Has a page under /projects/<slug> (case study or index). */
  hasCaseStudy: boolean
  /** Occupies a cartridge slot in the disk bay. Non-featured pages stay reachable. */
  featured: boolean
  /** Where to try it and where to read it. Shown under the case-study title. */
  links?: ProjectLink[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'meridian',
    title: 'Meridian',
    oneLiner: 'Online board game with an authoritative server',
    tags: ['R3F', 'DURABLE OBJECTS'],
    hasCaseStudy: true,
    featured: true,
    links: [
      { label: 'LIVE', href: 'https://meridian-client-fawn.vercel.app' },
      { label: 'SOURCE', href: 'https://github.com/Ayosage/meridian' },
    ],
  },
  {
    slug: 'steward',
    title: 'Steward',
    oneLiner: 'Discord bot that runs game nights',
    tags: ['DISCORD.JS', 'DRIZZLE'],
    hasCaseStudy: true,
    featured: true,
    links: [
      {
        label: 'ADD TO DISCORD',
        href: 'https://discord.com/oauth2/authorize?client_id=1544390696423915562&scope=bot%20applications.commands&permissions=268437504',
      },
      { label: 'SOURCE', href: 'https://github.com/Ayosage/steward' },
    ],
  },
  {
    slug: 'cellarkeep',
    title: 'CellarKeep',
    oneLiner: 'Production tracker for wine, mead and cider',
    tags: ['NEXT.JS', 'DRIZZLE'],
    hasCaseStudy: true,
    featured: true,
  },
  {
    slug: 'misc',
    title: 'Misc',
    oneLiner: 'Websites, tools and side work',
    tags: ['WEBSITES', 'WIP'],
    hasCaseStudy: true,
    featured: true,
  },
  {
    slug: 'stagepass',
    title: 'StagePass',
    oneLiner: 'Event ticketing backed by an on-chain ledger',
    tags: ['NEXT.JS', 'SOLIDITY'],
    hasCaseStudy: true,
    featured: false,
  },
]

export const FEATURED = PROJECTS.filter((p) => p.featured)

/** Links for a project, empty when it has none or does not exist. */
export function projectLinks(slug: string): ProjectLink[] {
  return PROJECTS.find((p) => p.slug === slug)?.links ?? []
}
