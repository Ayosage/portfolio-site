export default function About() {
  return (
    <main className="p-4 sm:p-6">
      <h1 className="phosphor-glow text-4xl font-bold uppercase tracking-tighter">Operator</h1>
      <div className="prose-body mt-4 max-w-[60ch] text-sm leading-relaxed">
        <p>
          Brandon Smith — full-stack engineer targeting web + web3 roles. I build
          products where the hard parts (payments, infra, chain state) stay
          invisible to the people using them.
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
