export type Project = {
  slug: string
  title: string
  oneLiner: string
  tags: string[]
  hasCaseStudy: boolean
}

export const PROJECTS: Project[] = [
  {
    slug: 'stagepass',
    title: 'StagePass',
    oneLiner: 'Ticketing with web3 under the hood',
    tags: ['NEXT.JS', 'SOLIDITY'],
    hasCaseStudy: true,
  },
  {
    slug: 'meridian',
    title: 'Meridian',
    oneLiner: 'Online board game, server-authoritative',
    tags: ['R3F', 'COLYSEUS'],
    hasCaseStudy: true,
  },
  {
    slug: 'steward',
    title: 'Steward',
    oneLiner: 'Discord bot that runs game nights',
    tags: ['DISCORD.JS', 'DRIZZLE'],
    hasCaseStudy: true,
  },
  {
    slug: 'cellarkeep',
    title: 'CellarKeep',
    oneLiner: 'Production tracker for wine, mead and cider',
    tags: ['NEXT.JS', 'DRIZZLE'],
    hasCaseStudy: true,
  },
]
