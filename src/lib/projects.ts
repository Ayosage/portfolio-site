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
  /** Two or three plain sentences. Shown where the project is listed under another. */
  blurb?: string
  /** Slugs of projects that ship inside this one. They list under it on the home index and its page. */
  games?: string[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'meridian',
    title: 'Meridian',
    oneLiner: 'Online board game with an authoritative server',
    tags: ['R3F', 'DURABLE OBJECTS'],
    hasCaseStudy: true,
    featured: false,
    blurb: 'The Catan base game with original names and art, on a 3D board in the browser. Up to four players. The server owns the rules, so nobody can cheat.',
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
    blurb: 'Steward runs game nights from Discord. One slash command launches a match and every player gets a private seat link. Results post back to the channel and count toward server stats.',
    games: ['meridian', 'wordy'],
    links: [
      {
        label: 'ADD TO DISCORD',
        href: 'https://discord.com/oauth2/authorize?client_id=1544390696423915562&scope=bot%20applications.commands&permissions=268437504',
      },
      { label: 'SOURCE', href: 'https://github.com/Ayosage/steward' },
    ],
  },
  {
    slug: 'wordy',
    title: 'Wordy Champions',
    oneLiner: 'PvP Wordle for two to eight, six rounds',
    tags: ['REACT', 'DURABLE OBJECTS'],
    hasCaseStudy: true,
    featured: false,
    blurb: 'Wordle as a race for two to eight players. Same word each round, six guesses, three minutes. Fewest guesses wins the round and points add up over six.',
    links: [
      { label: 'LIVE', href: 'https://wordy-client.vercel.app' },
      { label: 'SOURCE', href: 'https://github.com/Ayosage/wordy-champions' },
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

/** The projects listed under a project, in its declared order. Empty when it has none. */
export function gamesOf(slug: string): Project[] {
  const games = PROJECTS.find((p) => p.slug === slug)?.games ?? []
  return games.map((g) => PROJECTS.find((p) => p.slug === g)).filter((p): p is Project => p !== undefined)
}

/** Links for a project, empty when it has none or does not exist. */
export function projectLinks(slug: string): ProjectLink[] {
  return PROJECTS.find((p) => p.slug === slug)?.links ?? []
}
