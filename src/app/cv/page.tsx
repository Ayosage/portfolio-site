import type { Metadata } from 'next'
import Link from 'next/link'
import { CV, type CvEntry } from '@/lib/cv'
import { PROJECTS } from '@/lib/projects'
import { pageMetadata } from '@/lib/site'

export const metadata: Metadata = pageMetadata({
  title: 'CV',
  description: `${CV.name}'s CV: experience, projects and skills, on screen or as a PDF.`,
  path: '/cv',
})

const STUDIES = PROJECTS.filter((p) => p.hasCaseStudy)

function CvHeading({ title }: { title: string }) {
  return (
    <h2 className="mt-8 inline-block border-b border-[var(--phosphor-dim)] text-[12px] uppercase tracking-widest text-[var(--phosphor-dim)]">
      {title.toUpperCase()}
    </h2>
  )
}

function Entries({ entries }: { entries: CvEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="mt-3 text-[11px] tracking-[0.06em] text-[var(--phosphor-dim)]">
        {'// NO ENTRIES ON FILE YET'}
      </p>
    )
  }
  return (
    <ul className="mt-3 border-t border-[var(--hairline)]">
      {entries.map((e) => (
        <li
          key={e.org + e.role + e.dates}
          className="grid gap-x-6 gap-y-1 border-b border-[var(--hairline)] py-3 text-[12px] sm:grid-cols-[minmax(7rem,9rem)_1fr]"
        >
          <span className="text-[11px] tabular-nums tracking-[0.06em] text-[var(--phosphor-dim)]">
            {e.dates}
          </span>
          <div>
            <p className="font-bold tracking-wider">{e.role.toUpperCase()}</p>
            <p className="text-[11px] uppercase tracking-[0.06em] text-[var(--phosphor-dim)]">
              {e.org}
            </p>
            {e.notes.length > 0 && (
              <ul className="mt-2 max-w-[60ch] space-y-1 leading-relaxed">
                {e.notes.map((n) => (
                  <li key={n} className="pl-4 -indent-4">
                    <span aria-hidden="true" className="text-[var(--phosphor-dim)]">
                      {'- '}
                    </span>
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Cv() {
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        ~/cv
      </p>
      <h1 className="phosphor-glow mt-5 text-4xl font-bold uppercase tracking-tighter">CV</h1>
      <p className="mt-2 text-[12px] uppercase tracking-[0.08em]">
        <span className="text-[var(--phosphor-dim)]">{'> '}</span>
        {CV.name} <span className="text-[var(--phosphor-dim)]">·</span> {CV.headline}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--phosphor-dim)]">
        {CV.location} <span aria-hidden="true">·</span> open to work: {CV.regions}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-[0.04em]">
        <a
          href={CV.pdf.href}
          download={CV.pdf.filename}
          className="inline-flex min-h-11 items-center border border-[var(--phosphor)] px-3.5 py-2"
        >
          Download ▸ PDF
        </a>
        <a
          href={CV.pdf.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-[var(--hairline)] px-3.5 py-2 text-[var(--phosphor-dim)] hover:border-[var(--phosphor-dim)] hover:text-[var(--phosphor)]"
        >
          Open PDF ↗
        </a>
      </div>

      <div className="prose-body mt-6 max-w-[60ch] text-sm leading-relaxed">
        <p>{CV.summary}</p>
      </div>

      <section>
        <CvHeading title="Experience" />
        <Entries entries={CV.experience} />
      </section>

      <section>
        <CvHeading title="Projects" />
        <ul className="mt-3 border-t border-[var(--hairline)]">
          {STUDIES.map((p) => (
            <li
              key={p.slug}
              className="grid gap-x-6 gap-y-1 border-b border-[var(--hairline)] py-2.5 text-[12px] sm:grid-cols-[minmax(7rem,9rem)_1fr_auto]"
            >
              <span className="font-bold tracking-wider">{p.title.toUpperCase()}</span>
              <span>
                {p.oneLiner}
                <span className="mt-0.5 block text-[11px] uppercase tracking-[0.06em] text-[var(--phosphor-dim)] sm:mt-0 sm:ml-3 sm:inline">
                  {p.tags.join(' / ')}
                </span>
              </span>
              <Link
                href={`/projects/${p.slug}`}
                className="text-[11px] tracking-[0.08em] text-[var(--phosphor)] hover:underline"
              >
                READ ▸
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <CvHeading title="Skills" />
        <div className="mt-3 max-w-[560px] border border-[var(--hairline)]">
          <table aria-label="skills" className="w-full border-collapse text-[11px]">
            <tbody>
              {CV.skills.map(([k, v], i) => (
                <tr key={k} className={i === 0 ? undefined : 'border-t border-[var(--hairline)]'}>
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
      </section>

      <section>
        <CvHeading title="Education" />
        <Entries entries={CV.education} />
      </section>

      <section>
        <CvHeading title="Ports" />
        <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[11px]">
          {CV.ports.map((port) => {
            const external = port.href.startsWith('http')
            return (
              <li key={port.label}>
                {external ? (
                  <a
                    href={port.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center py-2 hover:underline"
                  >
                    {port.label} ↗
                  </a>
                ) : (
                  <Link
                    href={port.href}
                    className="inline-flex min-h-11 items-center py-2 hover:underline"
                  >
                    {port.label} ▸
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
