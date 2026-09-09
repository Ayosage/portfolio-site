export function SectionHeading({ index, title }: { index: number; title: string }) {
  const nn = String(index).padStart(2, '0')
  return (
    <h2
      className="mt-8 inline-block border-b border-[var(--phosphor-dim)] text-[12px] uppercase tracking-widest text-[var(--phosphor-dim)]"
    >
      {nn} — {title.toUpperCase()}
    </h2>
  )
}
