export type MiscLink = { label: 'LIVE' | 'SOURCE' | 'NOTES'; href: string }

export type MiscItem = {
  name: string
  links: MiscLink[]
  stack: string
}

export type MiscGroup = { category: string; items: MiscItem[] }

/** The MISC cartridge: everything not worth a full case study, grouped by kind. */
export const MISC: MiscGroup[] = [
  {
    category: 'Websites',
    items: [
      {
        name: 'This site (BS-01)',
        links: [
          { label: 'LIVE', href: 'https://www.brandons.sh' },
          { label: 'SOURCE', href: 'https://github.com/Ayosage/portfolio-site' },
        ],
        stack: 'Next.js 16 / React 19 / Tailwind 4 / WebGL / Resend / Vercel',
      },
      {
        name: 'Steeple Lofts',
        links: [
          { label: 'LIVE', href: 'https://www.steepleapartments.com' },
          { label: 'SOURCE', href: 'https://github.com/Ayosage/loft-uc' },
        ],
        stack: 'Next.js 15 / React 19 / Tailwind 4 / Resend / Vercel',
      },
    ],
  },
  {
    category: 'In progress',
    items: [
      {
        name: 'StagePass',
        links: [{ label: 'NOTES', href: '/projects/stagepass' }],
        stack: 'Next.js / Drizzle / Solidity / Base Sepolia',
      },
    ],
  },
]
