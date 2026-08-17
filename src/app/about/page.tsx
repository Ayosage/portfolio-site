export default function About() {
  return (
    <main className="p-4 sm:p-6">
      <h1 className="phosphor-glow text-4xl font-bold uppercase tracking-tighter">About</h1>
      <div className="prose-body mt-4 max-w-[60ch] text-sm leading-relaxed">
        <p>
          Brandon Smith — full-stack engineer working across web and web3. I build
          products where the hard parts — payments, infra, chain state — stay out
          of the user&apos;s way.
        </p>
        <p className="mt-3">
          Currently building a five-project portfolio: StagePass (flagship),
          Meridian, Steward, and CellarKeep.
        </p>
      </div>
      <a href="/resume.pdf" className="mt-6 inline-block border border-[var(--phosphor)] px-3 py-2 text-xs uppercase">
        Download resume ▸ PDF
      </a>
    </main>
  )
}
