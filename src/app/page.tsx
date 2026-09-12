import Link from 'next/link'
import { FEATURED, gamesOf } from '@/lib/projects'

export default function Home() {
  return (
    <main className="flex min-h-full flex-col p-4 sm:px-6 sm:py-5">
      <p className="border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        ~/brandon-smith
      </p>
      <h1 className="phosphor-glow mt-3.5 text-[clamp(2.2rem,min(10vw,15vh),5.6rem)] font-bold uppercase leading-[0.85] tracking-tighter">
        Brandon {' '}
        <br />
        Smith<span aria-hidden="true" className="cursor-blink" />
      </h1>
      <p className="mt-3 max-w-[60ch] text-[12px] leading-relaxed text-[var(--phosphor-dim)]">
        {'// full-stack engineer in Philadelphia. Java, TypeScript and AWS at JPMorgan Chase.'}
      </p>

      <section aria-label="media index" className="mt-4 border border-[var(--hairline)] sm:mt-5">
        <p className="flex justify-between border-b border-[var(--hairline)] px-2 py-1 text-[10px] tracking-[0.06em] text-[var(--phosphor-dim)]">
          <span>MEDIA<span className="hidden sm:inline"> ▪ SEATED IN THE DISK BAY BELOW</span></span>
          <span>{FEATURED.length} SLOTS</span>
        </p>
        <ul className="py-0.5">
          {FEATURED.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="grid grid-cols-[4ch_1fr] items-baseline gap-x-2 px-2 py-1.5 text-[12px] hover:bg-[color-mix(in_srgb,var(--phosphor)_10%,transparent)] sm:grid-cols-[5ch_16ch_1fr_auto]"
              >
                <span className="text-[var(--phosphor-dim)]">SL{i + 1}</span>
                <span className="font-bold tracking-wider">{p.title.toUpperCase()}</span>
                <span className="col-start-2 text-[var(--phosphor-dim)] sm:col-start-auto">{p.oneLiner}</span>
                <span className="hidden text-[10px] tracking-[0.08em] text-[var(--phosphor-dim)] sm:inline">
                  {p.tags.join(' / ')}
                </span>
              </Link>
              {p.games && (
                <ul aria-label={`games on ${p.title}`} className="pb-1">
                  {gamesOf(p.slug).map((g, j, all) => (
                    <li key={g.slug}>
                      <Link
                        href={`/projects/${g.slug}`}
                        className="grid grid-cols-[4ch_1fr] items-baseline gap-x-2 px-2 py-1 text-[12px] hover:bg-[color-mix(in_srgb,var(--phosphor)_10%,transparent)] sm:grid-cols-[5ch_16ch_1fr_auto]"
                      >
                        <span aria-hidden="true" className="text-right text-[var(--phosphor-dim)]">{j === all.length - 1 ? '└' : '├'}</span>
                        <span className="font-bold tracking-wider">{g.title.toUpperCase()}</span>
                        <span className="col-start-2 text-[var(--phosphor-dim)] sm:col-start-auto">{g.oneLiner}</span>
                        <span className="hidden text-[10px] tracking-[0.08em] text-[var(--phosphor-dim)] sm:inline">
                          {g.tags.join(' / ')}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-auto border-t border-[var(--hairline)] pt-3 text-[11px]">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a href="https://github.com/Ayosage" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center hover:underline">
              PORT-A ▸ GITHUB ↗
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/brandon-joshua-s-7001b21b9/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center hover:underline">
              PORT-B ▸ LINKEDIN ↗
            </a>
          </li>
          <li>
            <Link href="/contact" className="inline-flex min-h-10 items-center hover:underline">
              PORT-C ▸ EMAIL ▸
            </Link>
          </li>
        </ul>
      </footer>
    </main>
  )
}
