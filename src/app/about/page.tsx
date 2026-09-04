import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'Brandon Smith — full-stack engineer working across web and web3.',
  path: '/about',
})

const SPEC: [string, React.ReactNode][] = [
  ['Role', 'Full-stack engineer'],
  ['Stack', 'TypeScript · Next.js · Postgres · Solidity'],
  ['Location', 'Remote-friendly'],
  ['Availability', '● Open to work'],
  [
    'Ports',
    <span key="ports" className="flex flex-wrap gap-x-5 gap-y-1">
      <a href="https://github.com/Ayosage" className="hover:underline">
        GITHUB ↗
      </a>
      <a href="https://www.linkedin.com/in/brandon-smith" className="hover:underline">
        LINKEDIN ↗
      </a>
      <a href="mailto:aexbrandon@gmail.com" className="hover:underline">
        EMAIL ↗
      </a>
    </span>,
  ],
]

export default function About() {
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        ~/about
      </p>
      <h1 className="phosphor-glow mt-5 text-4xl font-bold uppercase tracking-tighter">About</h1>
      <div className="prose-body mt-4 max-w-[60ch] text-sm leading-relaxed">
        <p>
          Full-stack engineer working across web and web3. I build products where the
          hard parts — payments, infra, chain state — stay out of the user&apos;s way.
        </p>
      </div>

      <div className="mt-7 max-w-[560px] border border-[var(--hairline)]">
        <table aria-label="spec sheet" className="w-full border-collapse text-[11px]">
          <caption className="px-2 py-1 text-left text-[10px] tracking-[0.06em] text-[var(--phosphor-dim)]">
            SPEC SHEET
          </caption>
          <tbody>
          {SPEC.map(([k, v]) => (
            <tr key={k} className="border-t border-[var(--hairline)]">
              <th
                scope="row"
                className="w-24 px-2 py-1.5 text-left font-normal uppercase tracking-[0.1em] text-[var(--phosphor-dim)] sm:w-32"
              >
                {k}
              </th>
              <td className="px-2 py-1.5">{v}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      <a
        href="/resume.pdf"
        className="mt-7 inline-block border border-[var(--phosphor)] px-3.5 py-2 text-xs uppercase tracking-[0.04em]"
      >
        Download resume ▸ PDF
      </a>
    </main>
  )
}
