export function SectionHeading({ index, title }: { index: number; title: string }) {
  const nn = String(index).padStart(2, '0')
  return (
    <h2
      data-garden-section={index}
      className="mt-8 inline-block border-b border-[var(--phosphor-dim)] text-[11px] uppercase tracking-widest text-[var(--phosphor-dim)]"
    >
      {nn} — {title.toUpperCase()}
    </h2>
  )
}
