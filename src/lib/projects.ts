export type Project = {
  slug: string
  title: string
  oneLiner: string
  tags: string[]
  hasCaseStudy: boolean
}

export const PROJECTS: Project[] = [
  { slug: 'stagepass', title: 'StagePass', oneLiner: 'Ticketing — web3 under the hood', tags: ['NEXT.JS', 'SOLIDITY'], hasCaseStudy: true },
  { slug: 'meridian', title: 'Meridian', oneLiner: 'In progress', tags: [], hasCaseStudy: false },
  { slug: 'steward', title: 'Steward', oneLiner: 'In progress', tags: [], hasCaseStudy: false },
  { slug: 'cellarkeep', title: 'CellarKeep', oneLiner: 'In progress', tags: [], hasCaseStudy: false },
]
