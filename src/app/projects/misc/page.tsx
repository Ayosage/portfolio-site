import { PROJECTS } from '@/lib/projects'
import { LinkAnchor } from '@/components/case-study/LinkAnchor'
import { MISC } from '@/lib/misc'
import { pageMetadata } from '@/lib/site'
import { EscBack } from '@/components/case-study/EscBack'
import { SectionHeading } from '@/components/case-study/SectionHeading'

const project = PROJECTS.find((p) => p.slug === 'misc')!

export const metadata = pageMetadata({
  title: project.title,
  description: project.oneLiner,
  path: '/projects/misc',
})


export default function MiscIndex() {
  return (
    <main className="p-4 sm:p-6">
      <p className="flex justify-between border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        <span>~/work/misc</span>
        <EscBack />
      </p>
      <h1 className="phosphor-glow mt-4 text-4xl font-bold uppercase tracking-tighter sm:text-6xl">
        {project.title}
      </h1>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-[var(--phosphor-dim)]">
        {project.oneLiner}. Name, links, stack. No write-ups.
      </p>

      {MISC.map((group, gi) => (
        <section key={group.category}>
          <SectionHeading index={gi + 1} title={group.category} />
          <ul className="mt-3 border-t border-[var(--hairline)]">
            {group.items.map((item) => (
              <li
                key={item.name}
                className="grid gap-x-6 gap-y-1 border-b border-[var(--hairline)] py-2.5 text-[12px] sm:grid-cols-[minmax(10rem,14rem)_minmax(9rem,12rem)_1fr]"
              >
                <span className="font-bold tracking-wider">{item.name.toUpperCase()}</span>
                <span className="flex flex-wrap gap-x-4 text-[11px] tracking-[0.08em]">
                  {item.links.length === 0 ? (
                    <span className="text-[var(--phosphor-dim)]">NO PUBLIC LINK</span>
                  ) : (
                    item.links.map((l) => <LinkAnchor key={l.label + l.href} label={l.label} href={l.href} />)
                  )}
                </span>
                <span className="text-[11px] uppercase tracking-[0.06em] text-[var(--phosphor-dim)]">
                  {item.stack}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  )
}
