import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { LinkAnchor } from './LinkAnchor'

/** The games that ship on a platform project: name, a short description, where to play and where to read. */
export function GamesList({ games }: { games: Project[] }) {
  return (
    <section aria-label="games" data-testid="games" className="mt-4 border border-[var(--hairline)]">
      <p className="flex justify-between border-b border-[var(--hairline)] px-2 py-1 text-[10px] tracking-[0.06em] text-[var(--phosphor-dim)]">
        <span>GAMES ▪ ONE SLASH COMMAND EACH</span>
        <span>{games.length} TITLES</span>
      </p>
      <ul>
        {games.map((g) => (
          <li key={g.slug} className="border-b border-[var(--hairline)] px-2 py-2.5 last:border-b-0">
            <Link href={`/projects/${g.slug}`} className="inline-flex min-h-10 items-center text-[12px] font-bold tracking-wider hover:underline">
              ▣ {g.title.toUpperCase()} ▸
            </Link>
            <p className="prose-body max-w-[60ch] text-sm leading-relaxed">{g.blurb ?? g.oneLiner}</p>
            {g.links && g.links.length > 0 && (
              <p className="flex flex-wrap gap-x-6 text-[11px] tracking-[0.08em]">
                {g.links.map((l) => (
                  <LinkAnchor key={l.label + l.href} label={l.label} href={l.href} />
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
