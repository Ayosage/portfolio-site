export default function Home() {
  return (
    <main className="p-4 sm:p-6">
      <p className="border-b border-[var(--hairline)] pb-2 text-[10px] text-[var(--phosphor-dim)]">
        ~/brandon-smith
      </p>
      <h1 className="phosphor-glow mt-6 text-[clamp(3rem,14vw,7rem)] font-bold uppercase leading-[0.85] tracking-tighter">
        Brandon {' '}
        <br />
        Smith<span aria-hidden="true">█</span>
      </h1>
      <p className="mt-4 max-w-[46ch] text-xs text-[var(--phosphor-dim)]">
        {'// full-stack engineer — payments, infra, web3: invisible by design'}
      </p>

      {/* disk bay: task 11 */}

      <footer className="mt-10 border-t border-[var(--hairline)] pt-3 text-[10px]">
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          <li>
            <a href="https://github.com/Ayosage" className="hover:underline">
              PORT-A ▸ GITHUB ↗
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/brandon-smith" className="hover:underline">
              PORT-B ▸ LINKEDIN ↗
            </a>
          </li>
          <li>
            <a href="mailto:aexbrandon@gmail.com" className="hover:underline">
              PORT-C ▸ EMAIL ↗
            </a>
          </li>
        </ul>
      </footer>
    </main>
  )
}
