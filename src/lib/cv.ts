export type CvEntry = {
  org: string
  role: string
  /** Free text so a range can read "2024 — NOW". Rendered in tabular numerals. */
  dates: string
  notes: string[]
}

export type CvSkillRow = [label: string, items: string]

export type CvPort = { label: string; href: string }

/**
 * The CV as the terminal renders it. Every claim here is public elsewhere on
 * the site (About spec sheet, case studies, MISC index). Experience and
 * education stay empty until the real entries are supplied; the page shows a
 * designed empty state for an empty list rather than an invented one.
 */
export const CV = {
  name: 'Brandon Smith',
  headline: 'Full-stack engineer',
  summary:
    'Full-stack engineer working across web and web3. I build products where the hard parts, payments, infra and chain state, stay out of the user’s way.',
  pdf: { href: '/resume.pdf', filename: 'Brandon-Smith-CV.pdf' },
  experience: [] as CvEntry[],
  education: [] as CvEntry[],
  skills: [
    ['Languages', 'TypeScript · SQL · Solidity'],
    ['Frontend', 'React · Next.js · React Three Fiber · Tailwind'],
    ['Backend', 'Node · Postgres · Drizzle · Colyseus · discord.js'],
    ['Web3', 'Solidity · Foundry · ERC-721 · Base'],
    ['Ship', 'Vercel · Fly · Docker · GitHub Actions · Resend'],
  ] as CvSkillRow[],
  ports: [
    { label: 'GITHUB', href: 'https://github.com/Ayosage' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/brandon-smith' },
    { label: 'PING', href: '/contact' },
  ] as CvPort[],
}
