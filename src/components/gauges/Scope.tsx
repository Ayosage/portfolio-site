// Static trace until the oscilloscope task lands (docs/PLAN.md, post-launch).
export function Scope() {
  return (
    <div className="hidden border border-[var(--chassis-well)] bg-[var(--chassis-well)] p-1.5 text-[10px] text-[var(--chrome-dim)] sm:block">
      SCOPE
      <svg
        role="img"
        aria-label="scope trace, idle"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="mt-1 block h-8 w-full bg-[var(--screen)]"
      >
        <line x1="0" y1="20" x2="100" y2="20" stroke="var(--hairline)" strokeWidth="0.6" />
        <path
          d="M0 20 C6 20 6 6 12 6 S18 34 24 34 S30 6 36 6 S42 34 48 34 S54 6 60 6 S66 34 72 34 S78 6 84 6 S90 34 96 34 L100 22"
          fill="none"
          stroke="var(--phosphor)"
          strokeWidth="1.6"
        />
      </svg>
    </div>
  )
}
