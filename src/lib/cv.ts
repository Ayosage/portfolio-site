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
    'Full-stack engineer working across web and web3. I build products where the hard parts, payments, infra and chain state, stay out of the user’s way. Day job: Software Engineer III at JPMorgan Chase, modernizing Spring services and building AWS infrastructure and observability for regulated financial products.',
  location: 'Philadelphia, PA',
  regions: 'Philadelphia · NYC · New Jersey · Delaware · Remote',
  pdf: { href: '/resume.pdf', filename: 'Brandon-Smith-CV.pdf' },
  experience: [
    {
      org: 'JPMorgan Chase & Co.',
      role: 'Software Engineer III',
      dates: '2025 – NOW',
      notes: [
        'Own AWS management for 15 services across 8 environments, including batch applications and Lambda functions: account and infrastructure automation in Terraform, services deployed on Kubernetes.',
        'Build observability for production services in Splunk, Dynatrace, CloudWatch and Datadog: metrics, logging and alerting.',
        'Deliver Apple Card Promotional Services to production: reliability, security requirements and release readiness in a regulated environment.',
      ],
    },
    {
      org: 'JPMorgan Chase & Co.',
      role: 'Software Engineer II',
      dates: 'MAR 2023 – 2025',
      notes: [
        'Developed and modernized Java 21 and Spring backend services for Apple Card Promotional Services, supporting large-scale financial products.',
        'Moved legacy services toward cloud-native architecture on AWS as part of the platform modernization program.',
        'Built full-stack features in TypeScript, Node.js and React.',
      ],
    },
    {
      org: 'Heavy Seas Beer',
      role: 'Assistant Lab Manager',
      dates: 'AUG 2020 – MAR 2023',
      notes: [
        'Built Raspberry Pi integrations connecting lab instruments to data collection and analysis programs, replacing manual entry and improving traceability of production metrics.',
      ],
    },
    {
      org: 'PA Renaissance Faire · District Winery',
      role: 'Winemaking & Distilling',
      dates: '2017 – 2022',
      notes: [
        'Production from fermentation through packaging and release, with quality control.',
      ],
    },
  ] as CvEntry[],
  education: [
    {
      org: 'Kutztown University',
      role: 'B.S. Biology',
      dates: 'DEGREE',
      notes: [],
    },
    {
      org: 'Amazon Web Services',
      role: 'AWS Certified Cloud Practitioner',
      dates: 'CERT',
      notes: [],
    },
    {
      org: 'Codecademy',
      role: 'Certificate in Web Development',
      dates: 'CERT',
      notes: [],
    },
  ] as CvEntry[],
  skills: [
    ['Languages', 'TypeScript · Java 21 · SQL · Solidity'],
    ['Frontend', 'React · Next.js · React Three Fiber · Tailwind'],
    ['Backend', 'Node · Spring · Postgres · MongoDB · Drizzle · Colyseus · discord.js'],
    ['Web3', 'Solidity · Foundry · ERC-721 · Base'],
    ['Cloud', 'AWS · Terraform · Kubernetes · Docker · CI/CD'],
    ['Observability', 'Splunk · Dynatrace · CloudWatch · Datadog'],
    ['Ship', 'Vercel · Fly · GitHub Actions · Resend'],
  ] as CvSkillRow[],
  ports: [
    { label: 'GITHUB', href: 'https://github.com/Ayosage' },
    { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/brandon-joshua-s-7001b21b9/' },
    { label: 'PING', href: '/contact' },
  ] as CvPort[],
}
