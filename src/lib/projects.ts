export type Project = {
  slug: string
  title: string
  oneLiner: string
  tags: string[]
  /** Has a page under /projects/<slug> (case study or index). */
  hasCaseStudy: boolean
  /** Occupies a cartridge slot in the disk bay. Non-featured pages stay reachable. */
  featured: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: 'meridian',
    title: 'Meridian',
    oneLiner: 'Online board game with an authoritative server',
    tags: ['R3F', 'COLYSEUS'],
    hasCaseStudy: true,
    featured: true,
  },
  {
    slug: 'steward',
    title: 'Steward',
    oneLiner: 'Discord bot that runs game nights',
    tags: ['DISCORD.JS', 'DRIZZLE'],
    hasCaseStudy: true,
    featured: true,
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
