import Link from 'next/link'
import { EscBack } from '@/components/case-study/EscBack'
import { pageMetadata } from '@/lib/site'

// A 404 is never a destination, so it stays out of the index. Everything else
// matches the case-study header: path line, ESC BACK, phosphor h1.
export const metadata = {
  ...pageMetadata({
    title: '404',
    description: 'No such file on this terminal.',
    path: '/404',
  }),
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="p-4 sm:p-6">
      <p className="flex justify-between border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        <span>~/404</span>
        <EscBack />
      </p>
      <h1 className="phosphor-glow mt-4 text-balance text-4xl font-bold uppercase tracking-[-0.03em] sm:text-6xl">
        No such file
      </h1>
      <p className="mt-3 max-w-[60ch] text-[12px] leading-relaxed text-[var(--phosphor-dim)]">
        {'// nothing is mounted at that path. Check the address, or load a disk from the bay.'}
      </p>
      <p className="mt-6 text-[12px] tracking-[0.08em]">
        <Link className="underline underline-offset-4" href="/">
          F1 ▸ WORK INDEX
        </Link>
      </p>
    </main>
  )
}
