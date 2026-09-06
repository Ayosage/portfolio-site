import { DiskBay } from '@/components/diskbay/DiskBay'

export default function Home() {
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[11px] text-[var(--phosphor-dim)]">
        ~/brandon-smith
      </p>
      <h1 className="phosphor-glow mt-5 text-[clamp(3rem,14vw,7rem)] font-bold uppercase leading-[0.85] tracking-tighter">
        Brandon {' '}
        <br />
        Smith<span aria-hidden="true" className="cursor-blink" />
      </h1>
      <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-[var(--phosphor-dim)]">
        {"// full-stack engineer — payments, infra and web3, built properly and kept out of the user's way"}
      </p>

      <DiskBay />

      <footer className="mt-7 border-t sm:mt-10 border-[var(--hairline)] pt-3 text-[11px]">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a
              href="https://github.com/Ayosage"
              className="inline-flex min-h-11 items-center py-2 hover:underline"
            >
              PORT-A ▸ GITHUB ↗
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/brandon-smith"
              className="inline-flex min-h-11 items-center py-2 hover:underline"
            >
              PORT-B ▸ LINKEDIN ↗
            </a>
          </li>
          <li>
            <a
              href="mailto:aexbrandon@gmail.com"
              className="inline-flex min-h-11 items-center py-2 hover:underline"
            >
              PORT-C ▸ EMAIL ↗
            </a>
          </li>
        </ul>
      </footer>
    </main>
  )
}
