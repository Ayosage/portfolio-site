export type CvEntry = {
  org: string
  role: string
  /** Free text so a range can read "2024 – NOW". Rendered in tabular numerals. */
  dates: string
  notes: string[]
}

export type CvSkillRow = [label: string, items: string]

export type CvPort = { label: string; href: string }

/**
 * The CV as the terminal renders it. Every claim here is public elsewhere:
 * the About spec sheet, the case studies, the MISC index, or the resume PDF
 * at /resume.pdf, which this file mirrors. Keep the two in step.
 */
export const CV = {
  name: 'Brandon Smith',
  headline: 'Full-stack engineer',
  summary:
    'Full-stack engineer working across web and web3. I build products where the hard parts, payments, infra and chain state, stay out of the user’s way. Day job: Software Engineer II at JPMorgan Chase, modernizing Spring services and building AWS infrastructure for regulated financial products.',
  location: 'Philadelphia, PA',
  regions: 'Philadelphia · NYC · New Jersey · Delaware',
  pdf: { href: '/resume.pdf', filename: 'Brandon-Smith-CV.pdf' },
  experience: [
    {
      org: 'JPMorgan Chase & Co.',
      role: 'Software Engineer II',
      dates: 'MAR 2023 – NOW',
      notes: [
        'Develop and modernize Spring-based backend services behind large-scale financial products.',
        'Apple Card integration work: reliability, security requirements and production readiness in a regulated environment.',
        'Platform modernization moving legacy systems toward cloud-native architecture: AWS infrastructure in Terraform, services deployed on Kubernetes.',
        'Full-stack features in TypeScript, Node.js and React.',
      ],
    },
    {
      org: 'District Winery',
      role: 'Assistant Winemaker',
      dates: 'AUG 2022 – NOV 2022',
      notes: [
        'High-volume production: fermentation monitoring, blending, filtration, bottling and quality control.',
      ],
    },
    {
      org: 'Heavy Seas Beer',
      role: 'Assistant Lab Manager',
      dates: 'AUG 2020 – MAR 2023',
      notes: [
        'Ran laboratory quality systems for the brewery.',
        'Designed Raspberry Pi integrations connecting lab instruments to data collection and analysis programs.',
        'Automated workflows and improved traceability, consistency and production metric analysis.',
      ],
    },
    {
      org: 'PA Renaissance Faire',
      role: 'Assistant Winemaker & Distiller',
      dates: 'FEB 2017 – AUG 2020',
      notes: [
        'Owned projects from concept through fermentation, distillation, packaging and release, balancing experimentation with disciplined production and quality control.',
      ],
    },
  ] as CvEntry[],
  education: [
    {
      org: 'Amazon Web Services',
      role: 'AWS Certified Cloud Practitioner',
      dates: 'CERT',
      notes: [],
    },
    {
      org: 'Reading Area Community College',
      role: 'Associate in Business Administration',
      dates: 'DEGREE',
      notes: [],
    },
    {
      org: 'Codecademy',
      role: 'Certificate in Web Development',
      dates: 'CERT',
      notes: [],
    },
    {
      org: 'Professional Bartending School, Arlington',
      role: 'Diploma in Mixology',
      dates: 'DIPLOMA',
      notes: [],
    },
  ] as CvEntry[],
  skills: [
    ['Languages', 'TypeScript · Java · Go · SQL · Solidity'],
    ['Frontend', 'React · Next.js · React Three Fiber · Tailwind'],
    ['Backend', 'Node · Spring · Postgres · MongoDB · Drizzle · Colyseus · discord.js'],
    ['Web3', 'Solidity · Foundry · ERC-721 · Base'],
    ['Cloud', 'AWS · Terraform · Kubernetes · Docker · CI/CD'],
    ['Ship', 'Vercel · Fly · GitHub Actions · Resend'],
  ] as CvSkillRow[],
  ports: [
    { label: 'GITHUB', href: 'https://github.com/Ayosage' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/brandon-joshua-s-7001b21b9/' },
    { label: 'PING', href: '/contact' },
  ] as CvPort[],
}
