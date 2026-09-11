/** An outbound (↗) or in-site (▸) link in the terminal's underline style. */
export function LinkAnchor({ label, href }: { label: string; href: string }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="inline-flex min-h-10 items-center border-b border-[var(--phosphor-dim)] text-[var(--phosphor)] hover:border-[var(--phosphor)]"
    >
      {label} {external ? '↗' : '▸'}
    </a>
  )
}
